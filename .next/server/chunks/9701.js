"use strict";exports.id=9701,exports.ids=[9701],exports.modules={47458:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.AsyncFifoQueue=void 0;let Node=class Node{constructor(e){this.value=void 0,this.next=null,this.value=e}};let LinkedList=class LinkedList{constructor(){this.length=0,this.head=null,this.tail=null}push(e){let t=new Node(e);return this.length?this.tail.next=t:this.head=t,this.tail=t,this.length+=1,t}shift(){if(!this.length)return null;{let e=this.head;return this.head=this.head.next,this.length-=1,e}}};t.AsyncFifoQueue=class{constructor(e=!1){this.ignoreErrors=e,this.queue=new LinkedList,this.pending=new Set,this.newPromise()}add(e){this.pending.add(e),e.then(t=>{this.pending.delete(e),0===this.queue.length&&this.resolvePromise(t),this.queue.push(t)}).catch(t=>{this.ignoreErrors&&this.queue.push(void 0),this.pending.delete(e),this.rejectPromise(t)})}async waitAll(){await Promise.all(this.pending)}numTotal(){return this.pending.size+this.queue.length}numPending(){return this.pending.size}numQueued(){return this.queue.length}resolvePromise(e){this.resolve(e),this.newPromise()}rejectPromise(e){this.reject(e),this.newPromise()}newPromise(){this.nextPromise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}async wait(){return this.nextPromise}async fetch(){var e;if(0!==this.pending.size||0!==this.queue.length){for(;0===this.queue.length;)try{await this.wait()}catch(e){this.ignoreErrors||console.error("Unexpected Error in AsyncFifoQueue",e)}return null===(e=this.queue.shift())||void 0===e?void 0:e.value}}}},34310:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Backoffs=void 0;let Backoffs=class Backoffs{static normalize(e){return Number.isFinite(e)?{type:"fixed",delay:e}:e||void 0}static calculate(e,t,r,n,a){if(e){let i=function(e,t){if(e.type in Backoffs.builtinStrategies)return Backoffs.builtinStrategies[e.type](e.delay,e.jitter);if(t)return t;throw Error(`Unknown backoff strategy ${e.type}.
      If a custom backoff strategy is used, specify it when the queue is created.`)}(e,a);return i(t,e.type,r,n)}}};t.Backoffs=Backoffs,Backoffs.builtinStrategies={fixed:function(e,t=0){return function(){return t>0?Math.floor(Math.random()*e*t+e*(1-t)):e}},exponential:function(e,t=0){return function(r){if(!(t>0))return Math.round(Math.pow(2,r-1)*e);{let n=Math.round(Math.pow(2,r-1)*e);return Math.floor(Math.random()*n*t+n*(1-t))}}}}},19423:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ChildPool=void 0;let n=r(71017),a=r(4639),supportCJS=()=>"object"==typeof e.exports;t.ChildPool=class{constructor({mainFile:e=supportCJS()?n.join(process.cwd(),"dist/cjs/classes/main.js"):n.join(process.cwd(),"dist/esm/classes/main.js"),useWorkerThreads:t,workerForkOptions:r,workerThreadsOptions:a}){this.retained={},this.free={},this.opts={mainFile:e,useWorkerThreads:t,workerForkOptions:r,workerThreadsOptions:a}}async retain(e){let t=this.getFree(e).pop();if(t)return this.retained[t.pid]=t,t;(t=new a.Child(this.opts.mainFile,e,{useWorkerThreads:this.opts.useWorkerThreads,workerForkOptions:this.opts.workerForkOptions,workerThreadsOptions:this.opts.workerThreadsOptions})).on("exit",this.remove.bind(this,t));try{if(await t.init(),null!==t.exitCode||null!==t.signalCode)throw Error("Child exited before it could be retained");return this.retained[t.pid]=t,t}catch(e){throw console.error(e),this.release(t),e}}release(e){delete this.retained[e.pid],this.getFree(e.processFile).push(e)}remove(e){delete this.retained[e.pid];let t=this.getFree(e.processFile),r=t.indexOf(e);r>-1&&t.splice(r,1)}async kill(e,t="SIGKILL"){return this.remove(e),e.kill(t,3e4)}async clean(){let e=Object.values(this.retained).concat(this.getAllFree());this.retained={},this.free={},await Promise.all(e.map(e=>this.kill(e,"SIGTERM")))}getFree(e){return this.free[e]=this.free[e]||[]}getAllFree(){return Object.values(this.free).reduce((e,t)=>e.concat(t),[])}}},13846:(e,t,r)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),t.ChildProcessor=void 0;let a=r(90875),i=r(2394);(function(e){e[e.Idle=0]="Idle",e[e.Started=1]="Started",e[e.Terminating=2]="Terminating",e[e.Errored=3]="Errored"})(n||(n={})),t.ChildProcessor=class{constructor(e,t){this.send=e,this.receiver=t}async init(e){let t;try{let{default:n}=await r(16314)(e);if((t=n).default&&(t=t.default),"function"!=typeof t)throw Error("No function is exported in processor file")}catch(e){return this.status=n.Errored,this.send({cmd:a.ParentCommand.InitFailed,err:(0,i.errorToJSON)(e)})}let o=t;t=function(e,t){try{return Promise.resolve(o(e,t))}catch(e){return Promise.reject(e)}},this.processor=t,this.status=n.Idle,await this.send({cmd:a.ParentCommand.InitCompleted})}async start(e,t){if(this.status!==n.Idle)return this.send({cmd:a.ParentCommand.Error,err:(0,i.errorToJSON)(Error("cannot start a not idling child process"))});this.status=n.Started,this.currentJobPromise=(async()=>{try{let r=this.wrapJob(e,this.send),n=await this.processor(r,t);await this.send({cmd:a.ParentCommand.Completed,value:void 0===n?null:n})}catch(e){await this.send({cmd:a.ParentCommand.Failed,value:(0,i.errorToJSON)(e.message?e:Error(e))})}finally{this.status=n.Idle,this.currentJobPromise=void 0}})()}async stop(){}async waitForCurrentJobAndExit(){this.status=n.Terminating;try{await this.currentJobPromise}finally{process.exit(process.exitCode||0)}}wrapJob(e,t){let r=Object.assign(Object.assign({},e),{queueQualifiedName:e.queueQualifiedName,data:JSON.parse(e.data||"{}"),opts:e.opts,returnValue:JSON.parse(e.returnvalue||"{}"),async updateProgress(e){this.progress=e,await t({cmd:a.ParentCommand.Progress,value:e})},log:async e=>{await t({cmd:a.ParentCommand.Log,value:e})},moveToDelayed:async(e,r)=>{await t({cmd:a.ParentCommand.MoveToDelayed,value:{timestamp:e,token:r}})},moveToWait:async e=>{await t({cmd:a.ParentCommand.MoveToWait,value:{token:e}})},moveToWaitingChildren:async(e,r)=>{let n=Math.random().toString(36).substring(2,15);return await t({requestId:n,cmd:a.ParentCommand.MoveToWaitingChildren,value:{token:e,opts:r}}),waitResponse(n,this.receiver,5e3,"moveToWaitingChildren")},updateData:async e=>{await t({cmd:a.ParentCommand.Update,value:e}),r.data=e},getChildrenValues:async()=>{let e=Math.random().toString(36).substring(2,15);return await t({requestId:e,cmd:a.ParentCommand.GetChildrenValues}),waitResponse(e,this.receiver,5e3,"getChildrenValues")},getIgnoredChildrenFailures:async()=>{let e=Math.random().toString(36).substring(2,15);return await t({requestId:e,cmd:a.ParentCommand.GetIgnoredChildrenFailures}),waitResponse(e,this.receiver,5e3,"getIgnoredChildrenFailures")}});return r}};let waitResponse=async(e,t,r,n)=>new Promise((a,i)=>{let listener=r=>{r.requestId===e&&(a(r.value),t.off("message",listener))};t.on("message",listener),setTimeout(()=>{t.off("message",listener),i(Error(`TimeoutError: ${n} timed out in (${r}ms)`))},r)})},4639:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Child=void 0;let n=r(32081),a=r(41808),i=r(71267),o=r(90875),s=r(82361),l={1:"Uncaught Fatal Exception",2:"Unused",3:"Internal JavaScript Parse Error",4:"Internal JavaScript Evaluation Failure",5:"Fatal Error",6:"Non-function Internal Exception Handler",7:"Internal Exception Handler Run-Time Failure",8:"Unused",9:"Invalid Argument",10:"Internal JavaScript Run-Time Failure",12:"Invalid Debug Argument",13:"Unfinished Top-Level Await"};let Child=class Child extends s.EventEmitter{constructor(e,t,r={useWorkerThreads:!1}){super(),this.mainFile=e,this.processFile=t,this.opts=r,this._exitCode=null,this._signalCode=null,this._killed=!1}get pid(){if(this.childProcess)return this.childProcess.pid;if(this.worker)return Math.abs(this.worker.threadId);throw Error("No child process or worker thread")}get exitCode(){return this._exitCode}get signalCode(){return this._signalCode}get killed(){return this.childProcess?this.childProcess.killed:this._killed}async init(){let e;let t=await convertExecArgv(process.execArgv);this.opts.useWorkerThreads?this.worker=e=new i.Worker(this.mainFile,Object.assign({execArgv:t,stdin:!0,stdout:!0,stderr:!0},this.opts.workerThreadsOptions?this.opts.workerThreadsOptions:{})):this.childProcess=e=(0,n.fork)(this.mainFile,[],Object.assign({execArgv:t,stdio:"pipe"},this.opts.workerForkOptions?this.opts.workerForkOptions:{})),e.on("exit",(t,r)=>{this._exitCode=t,r=void 0===r?null:r,this._signalCode=r,this._killed=!0,this.emit("exit",t,r),e.removeAllListeners(),this.removeAllListeners()}),e.on("error",(...e)=>this.emit("error",...e)),e.on("message",(...e)=>this.emit("message",...e)),e.on("close",(...e)=>this.emit("close",...e)),e.stdout.pipe(process.stdout),e.stderr.pipe(process.stderr),await this.initChild()}async send(e){return new Promise((t,r)=>{this.childProcess?this.childProcess.send(e,e=>{e?r(e):t()}):this.worker?t(this.worker.postMessage(e)):t()})}killProcess(e="SIGKILL"){this.childProcess?this.childProcess.kill(e):this.worker&&this.worker.terminate()}async kill(e="SIGKILL",t){var r;if(this.hasProcessExited())return;let n=(r=this.childProcess||this.worker,new Promise(e=>{r.once("exit",()=>e())}));if(this.killProcess(e),void 0!==t&&(0===t||isFinite(t))){let e=setTimeout(()=>{this.hasProcessExited()||this.killProcess("SIGKILL")},t);await n,clearTimeout(e)}await n}async initChild(){let e=new Promise((e,t)=>{let onMessageHandler=r=>{if(r.cmd===o.ParentCommand.InitCompleted)e();else if(r.cmd===o.ParentCommand.InitFailed){let e=Error();e.stack=r.err.stack,e.message=r.err.message,t(e)}this.off("message",onMessageHandler),this.off("close",onCloseHandler)},onCloseHandler=(e,r)=>{e>128&&(e-=128);let n=l[e]||`Unknown exit code ${e}`;t(Error(`Error initializing child: ${n} and signal ${r}`)),this.off("message",onMessageHandler),this.off("close",onCloseHandler)};this.on("message",onMessageHandler),this.on("close",onCloseHandler)});await this.send({cmd:o.ChildCommand.Init,value:this.processFile}),await e}hasProcessExited(){return!!(null!==this.exitCode||this.signalCode)}};t.Child=Child;let getFreePort=async()=>new Promise(e=>{let t=(0,a.createServer)();t.listen(0,()=>{let{port:r}=t.address();t.close(()=>e(r))})}),convertExecArgv=async e=>{let t=[],r=[];for(let n=0;n<e.length;n++){let a=e[n];if(-1===a.indexOf("--inspect"))t.push(a);else{let e=a.split("=")[0],t=await getFreePort();r.push(`${e}=${t}`)}}return t.concat(r)}},68685:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DelayedError=t.DELAYED_ERROR=void 0,t.DELAYED_ERROR="bullmq:movedToDelayed",t.DelayedError=class extends Error{constructor(e=t.DELAYED_ERROR){super(e),this.name=this.constructor.name,Object.setPrototypeOf(this,new.target.prototype)}}},12546:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(87175);n.__exportStar(r(68685),t),n.__exportStar(r(69932),t),n.__exportStar(r(2809),t),n.__exportStar(r(62002),t),n.__exportStar(r(6098),t)},69932:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RateLimitError=t.RATE_LIMIT_ERROR=void 0,t.RATE_LIMIT_ERROR="bullmq:rateLimitExceeded",t.RateLimitError=class extends Error{constructor(e=t.RATE_LIMIT_ERROR){super(e),this.name=this.constructor.name,Object.setPrototypeOf(this,new.target.prototype)}}},2809:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UnrecoverableError=t.UNRECOVERABLE_ERROR=void 0,t.UNRECOVERABLE_ERROR="bullmq:unrecoverable",t.UnrecoverableError=class extends Error{constructor(e=t.UNRECOVERABLE_ERROR){super(e),this.name=this.constructor.name,Object.setPrototypeOf(this,new.target.prototype)}}},62002:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.WaitingChildrenError=t.WAITING_CHILDREN_ERROR=void 0,t.WAITING_CHILDREN_ERROR="bullmq:movedToWaitingChildren",t.WaitingChildrenError=class extends Error{constructor(e=t.WAITING_CHILDREN_ERROR){super(e),this.name=this.constructor.name,Object.setPrototypeOf(this,new.target.prototype)}}},6098:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.WaitingError=t.WAITING_ERROR=void 0,t.WAITING_ERROR="bullmq:movedToWait",t.WaitingError=class extends Error{constructor(e=t.WAITING_ERROR){super(e),this.name=this.constructor.name,Object.setPrototypeOf(this,new.target.prototype)}}},7381:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.FlowProducer=void 0;let n=r(82361),a=r(9925),i=r(2394),o=r(96596),s=r(97503),l=r(244),d=r(90875);let FlowProducer=class FlowProducer extends n.EventEmitter{constructor(e={connection:{}},t=l.RedisConnection){super(),this.opts=e,this.opts=Object.assign({prefix:"bull"},e),this.connection=new t(e.connection,{shared:(0,i.isRedisInstance)(e.connection),blocking:!1,skipVersionCheck:e.skipVersionCheck,skipWaitingForReady:e.skipWaitingForReady}),this.connection.on("error",e=>this.emit("error",e)),this.connection.on("close",()=>{this.closing||this.emit("ioredis:close")}),this.queueKeys=new s.QueueKeys(e.prefix),(null==e?void 0:e.telemetry)&&(this.telemetry=e.telemetry)}emit(e,...t){return super.emit(e,...t)}off(e,t){return super.off(e,t),this}on(e,t){return super.on(e,t),this}once(e,t){return super.once(e,t),this}get client(){return this.connection.client}get Job(){return o.Job}waitUntilReady(){return this.client}async add(e,t){var r;if(this.closing)return;let n=await this.connection.client,a=n.multi(),o=null===(r=null==e?void 0:e.opts)||void 0===r?void 0:r.parent,s=(0,i.getParentKey)(o),l=s?`${s}:dependencies`:void 0;return(0,i.trace)(this.telemetry,d.SpanKind.PRODUCER,e.queueName,"addFlow",e.queueName,async r=>{null==r||r.setAttributes({[d.TelemetryAttributes.FlowName]:e.name});let n=await this.addNode({multi:a,node:e,queuesOpts:null==t?void 0:t.queuesOptions,parent:{parentOpts:o,parentDependenciesKey:l}});return await a.exec(),n})}async getFlow(e){if(this.closing)return;let t=await this.connection.client,r=Object.assign({depth:10,maxChildren:20,prefix:this.opts.prefix},e),n=this.getNode(t,r);return n}async addBulk(e){if(this.closing)return;let t=await this.connection.client,r=t.multi();return(0,i.trace)(this.telemetry,d.SpanKind.PRODUCER,"","addBulkFlows","",async t=>{null==t||t.setAttributes({[d.TelemetryAttributes.BulkCount]:e.length,[d.TelemetryAttributes.BulkNames]:e.map(e=>e.name).join(",")});let n=await this.addNodes(r,e);return await r.exec(),n})}async addNode({multi:e,node:t,parent:r,queuesOpts:n}){var o,l;let u=t.prefix||this.opts.prefix,c=this.queueFromNode(t,new s.QueueKeys(u),u),p=n&&n[t.queueName],y=null!==(o=null==p?void 0:p.defaultJobOptions)&&void 0!==o?o:{},m=(null===(l=t.opts)||void 0===l?void 0:l.jobId)||(0,a.v4)();return(0,i.trace)(this.telemetry,d.SpanKind.PRODUCER,t.queueName,"addNode",t.queueName,async(a,o)=>{var l,u;null==a||a.setAttributes({[d.TelemetryAttributes.JobName]:t.name,[d.TelemetryAttributes.JobId]:m});let p=t.opts,h=null==p?void 0:p.telemetry;if(o&&p){let e=null===(l=p.telemetry)||void 0===l?void 0:l.omitContext,t=(null===(u=p.telemetry)||void 0===u?void 0:u.metadata)||!e&&o;(t||e)&&(h={metadata:t,omitContext:e})}let f=new this.Job(c,t.name,t.data,Object.assign(Object.assign(Object.assign({},y),p),{parent:null==r?void 0:r.parentOpts,telemetry:h}),m),b=(0,i.getParentKey)(null==r?void 0:r.parentOpts);if(!t.children||!(t.children.length>0))return await f.addJob(e,{parentDependenciesKey:null==r?void 0:r.parentDependenciesKey,parentKey:b}),{job:f};{let a=new s.QueueKeys(t.prefix||this.opts.prefix);await f.addJob(e,{parentDependenciesKey:null==r?void 0:r.parentDependenciesKey,addToWaitingChildren:!0,parentKey:b});let i=`${a.toKey(t.queueName,m)}:dependencies`,o=await this.addChildren({multi:e,nodes:t.children,parent:{parentOpts:{id:m,queue:a.getQueueQualifiedName(t.queueName)},parentDependenciesKey:i},queuesOpts:n});return{job:f,children:o}}})}addNodes(e,t){return Promise.all(t.map(t=>{var r;let n=null===(r=null==t?void 0:t.opts)||void 0===r?void 0:r.parent,a=(0,i.getParentKey)(n),o=a?`${a}:dependencies`:void 0;return this.addNode({multi:e,node:t,parent:{parentOpts:n,parentDependenciesKey:o}})}))}async getNode(e,t){let r=this.queueFromNode(t,new s.QueueKeys(t.prefix),t.prefix),n=await this.Job.fromId(r,t.id);if(n){let{processed:r={},unprocessed:a=[],failed:i=[],ignored:o={}}=await n.getDependencies({failed:{count:t.maxChildren},processed:{count:t.maxChildren},unprocessed:{count:t.maxChildren},ignored:{count:t.maxChildren}}),s=Object.keys(r),l=Object.keys(o),d=s.length+a.length+l.length+i.length,u=t.depth-1;if(!(d>0)||!u)return{job:n};{let r=await this.getChildren(e,[...s,...a,...i,...l],u,t.maxChildren);return{job:n,children:r}}}}addChildren({multi:e,nodes:t,parent:r,queuesOpts:n}){return Promise.all(t.map(t=>this.addNode({multi:e,node:t,parent:r,queuesOpts:n})))}getChildren(e,t,r,n){return Promise.all([...t.map(t=>{let[a,i,o]=t.split(":");return this.getNode(e,{id:o,queueName:i,prefix:a,depth:r,maxChildren:n})})])}queueFromNode(e,t,r){return{client:this.connection.client,name:e.queueName,keys:t.getKeys(e.queueName),toKey:r=>t.toKey(e.queueName,r),opts:{prefix:r,connection:{}},qualifiedName:t.getQueueQualifiedName(e.queueName),closing:this.closing,waitUntilReady:async()=>this.connection.client,removeListener:this.removeListener.bind(this),emit:this.emit.bind(this),on:this.on.bind(this),redisVersion:this.connection.redisVersion,trace:async()=>{}}}async close(){this.closing||(this.closing=this.connection.close()),await this.closing}disconnect(){return this.connection.disconnect()}};t.FlowProducer=FlowProducer},61171:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(87175);n.__exportStar(r(47458),t),n.__exportStar(r(34310),t),n.__exportStar(r(4639),t),n.__exportStar(r(19423),t),n.__exportStar(r(13846),t),n.__exportStar(r(12546),t),n.__exportStar(r(7381),t),n.__exportStar(r(96596),t),n.__exportStar(r(69550),t),n.__exportStar(r(94533),t),n.__exportStar(r(21918),t),n.__exportStar(r(38725),t),n.__exportStar(r(49416),t),n.__exportStar(r(97503),t),n.__exportStar(r(82759),t),n.__exportStar(r(244),t),n.__exportStar(r(55587),t),n.__exportStar(r(43754),t),n.__exportStar(r(96727),t),n.__exportStar(r(10254),t)},69550:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.defaultRepeatStrategy=t.JobScheduler=void 0;let n=r(87175),a=r(96716),i=r(96596),o=r(94533),s=r(90875),l=r(2394);let JobScheduler=class JobScheduler extends o.QueueBase{constructor(e,r,n){super(e,r,n),this.repeatStrategy=r.settings&&r.settings.repeatStrategy||t.defaultRepeatStrategy}async upsertJobScheduler(e,t,r,a,o,{override:l,producerId:d}){let u;let{every:c,limit:p,pattern:y,offset:m}=t;if(y&&c)throw Error("Both .pattern and .every options are defined for this repeatable job");if(!y&&!c)throw Error("Either .pattern or .every options must be defined for this repeatable job");if(t.immediately&&t.startDate)throw Error("Both .immediately and .startDate options are defined for this repeatable job");t.immediately&&t.every&&console.warn("Using option immediately with every does not affect the job's schedule. Job will run immediately anyway.");let h=t.count?t.count+1:1;if(void 0!==t.limit&&h>t.limit)return;let f=Date.now(),{endDate:b}=t;if(b&&f>new Date(b).getTime())return;let K=o.prevMillis||0;f=K<f?f:K;let{immediately:g}=t,v=n.__rest(t,["immediately"]);if(y&&(u=await this.repeatStrategy(f,t,r))<f&&(u=f),u||c)return this.trace(s.SpanKind.PRODUCER,"add",`${this.name}.${r}`,async(n,m)=>{var K,g;let I=o.telemetry;if(m){let e=null===(K=o.telemetry)||void 0===K?void 0:K.omitContext,t=(null===(g=o.telemetry)||void 0===g?void 0:g.metadata)||!e&&m;(t||e)&&(I={metadata:t,omitContext:e})}let E=this.getNextJobOpts(u,e,Object.assign(Object.assign({},o),{repeat:v,telemetry:I}),h,null);if(l){u<f&&(u=f);let[l,m]=await this.scripts.addJobScheduler(e,u,JSON.stringify(void 0===a?{}:a),i.Job.optsAsJSON(o),{name:r,startDate:t.startDate?new Date(t.startDate).getTime():void 0,endDate:b?new Date(b).getTime():void 0,tz:t.tz,pattern:y,every:c,limit:p,offset:null},i.Job.optsAsJSON(E),d),h="string"==typeof m?parseInt(m,10):m,K=new this.Job(this,r,a,Object.assign(Object.assign({},E),{delay:h}),l);return K.id=l,null==n||n.setAttributes({[s.TelemetryAttributes.JobSchedulerId]:e,[s.TelemetryAttributes.JobId]:K.id}),K}{let t=await this.scripts.updateJobSchedulerNextMillis(e,u,JSON.stringify(void 0===a?{}:a),i.Job.optsAsJSON(E),d);if(t){let i=new this.Job(this,r,a,E,t);return i.id=t,null==n||n.setAttributes({[s.TelemetryAttributes.JobSchedulerId]:e,[s.TelemetryAttributes.JobId]:i.id}),i}}})}getNextJobOpts(e,t,r,n,a){var i,o;let s=this.getSchedulerNextJobId({jobSchedulerId:t,nextMillis:e}),l=Date.now(),d=e+a-l,u=Object.assign(Object.assign({},r),{jobId:s,delay:d<0?0:d,timestamp:l,prevMillis:e,repeatJobKey:t});return u.repeat=Object.assign(Object.assign({},r.repeat),{offset:a,count:n,startDate:(null===(i=r.repeat)||void 0===i?void 0:i.startDate)?new Date(r.repeat.startDate).getTime():void 0,endDate:(null===(o=r.repeat)||void 0===o?void 0:o.endDate)?new Date(r.repeat.endDate).getTime():void 0}),u}async removeJobScheduler(e){return this.scripts.removeJobScheduler(e)}async getSchedulerData(e,t,r){let n=await e.hgetall(this.toKey("repeat:"+t));return this.transformSchedulerData(t,n,r)}transformSchedulerData(e,t,r){if(t){let n={key:e,name:t.name,next:r};return t.ic&&(n.iterationCount=parseInt(t.ic)),t.limit&&(n.limit=parseInt(t.limit)),t.startDate&&(n.startDate=parseInt(t.startDate)),t.endDate&&(n.endDate=parseInt(t.endDate)),t.tz&&(n.tz=t.tz),t.pattern&&(n.pattern=t.pattern),t.every&&(n.every=parseInt(t.every)),t.offset&&(n.offset=parseInt(t.offset)),(t.data||t.opts)&&(n.template=this.getTemplateFromJSON(t.data,t.opts)),n}if(e.includes(":"))return this.keyToData(e,r)}keyToData(e,t){let r=e.split(":"),n=r.slice(4).join(":")||null;return{key:e,name:r[0],id:r[1]||null,endDate:parseInt(r[2])||null,tz:r[3]||null,pattern:n,next:t}}async getScheduler(e){let[t,r]=await this.scripts.getJobScheduler(e);return this.transformSchedulerData(e,t?(0,l.array2obj)(t):null,r?parseInt(r):null)}getTemplateFromJSON(e,t){let r={};return e&&(r.data=JSON.parse(e)),t&&(r.opts=i.Job.optsFromJSON(t)),r}async getJobSchedulers(e=0,t=-1,r=!1){let n=await this.client,a=this.keys.repeat,i=r?await n.zrange(a,e,t,"WITHSCORES"):await n.zrevrange(a,e,t,"WITHSCORES"),o=[];for(let e=0;e<i.length;e+=2)o.push(this.getSchedulerData(n,i[e],parseInt(i[e+1])));return Promise.all(o)}async getSchedulersCount(){let e=this.keys.repeat,t=await this.client;return t.zcard(e)}getSchedulerNextJobId({nextMillis:e,jobSchedulerId:t}){return`repeat:${t}:${e}`}};t.JobScheduler=JobScheduler,t.defaultRepeatStrategy=(e,t)=>{let{pattern:r}=t,n=new Date(e),i=t.startDate&&new Date(t.startDate),o=(0,a.parseExpression)(r,Object.assign(Object.assign({},t),{currentDate:i>n?i:n}));try{if(t.immediately)return new Date().getTime();return o.next().getTime()}catch(e){}}},96596:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Job=t.PRIORITY_LIMIT=void 0;let n=r(87175),a=r(73837),i=r(2394),o=r(57669),s=r(34310),l=r(2809),d=r(90875),u=(0,a.debuglog)("bull");t.PRIORITY_LIMIT=2097152;let Job=class Job{constructor(e,t,r,a={},o){this.queue=e,this.name=t,this.data=r,this.opts=a,this.id=o,this.progress=0,this.returnvalue=null,this.stacktrace=null,this.delay=0,this.priority=0,this.attemptsStarted=0,this.attemptsMade=0,this.stalledCounter=0;let l=this.opts,{repeatJobKey:d}=l,u=n.__rest(l,["repeatJobKey"]);this.opts=Object.assign({attempts:0},u),this.delay=this.opts.delay,this.priority=this.opts.priority||0,this.repeatJobKey=d,this.timestamp=a.timestamp?a.timestamp:Date.now(),this.opts.backoff=s.Backoffs.normalize(a.backoff),this.parentKey=(0,i.getParentKey)(a.parent),a.parent&&(this.parent={id:a.parent.id,queueKey:a.parent.queue},a.failParentOnFailure&&(this.parent.fpof=!0),a.removeDependencyOnFailure&&(this.parent.rdof=!0),a.ignoreDependencyOnFailure&&(this.parent.idof=!0),a.continueParentOnFailure&&(this.parent.cpof=!0)),this.debounceId=a.debounce?a.debounce.id:void 0,this.deduplicationId=a.deduplication?a.deduplication.id:this.debounceId,this.toKey=e.toKey.bind(e),this.createScripts(),this.queueQualifiedName=e.qualifiedName}static async create(e,t,r,n){let a=await e.client,i=new this(e,t,r,n,n&&n.jobId);return i.id=await i.addJob(a,{parentKey:i.parentKey,parentDependenciesKey:i.parentKey?`${i.parentKey}:dependencies`:""}),i}static async createBulk(e,t){let r=await e.client,n=t.map(t=>{var r;return new this(e,t.name,t.data,t.opts,null===(r=t.opts)||void 0===r?void 0:r.jobId)}),a=r.pipeline();for(let e of n)e.addJob(a,{parentKey:e.parentKey,parentDependenciesKey:e.parentKey?`${e.parentKey}:dependencies`:""});let i=await a.exec();for(let e=0;e<i.length;++e){let[t,r]=i[e];if(t)throw t;n[e].id=r}return n}static fromJSON(e,t,r){let n=JSON.parse(t.data||"{}"),a=Job.optsFromJSON(t.opts),o=new this(e,t.name,n,a,t.id||r);return o.progress=JSON.parse(t.progress||"0"),o.delay=parseInt(t.delay),o.priority=parseInt(t.priority),o.timestamp=parseInt(t.timestamp),t.finishedOn&&(o.finishedOn=parseInt(t.finishedOn)),t.processedOn&&(o.processedOn=parseInt(t.processedOn)),t.rjk&&(o.repeatJobKey=t.rjk),t.deid&&(o.debounceId=t.deid,o.deduplicationId=t.deid),t.failedReason&&(o.failedReason=t.failedReason),o.attemptsStarted=parseInt(t.ats||"0"),o.attemptsMade=parseInt(t.attemptsMade||t.atm||"0"),o.stalledCounter=parseInt(t.stc||"0"),t.defa&&(o.deferredFailure=t.defa),o.stacktrace=function(e){if(!e)return[];let t=(0,i.tryCatch)(JSON.parse,JSON,[e]);return t!==i.errorObject&&t instanceof Array?t:[]}(t.stacktrace),"string"==typeof t.returnvalue&&(o.returnvalue=getReturnValue(t.returnvalue)),t.parentKey&&(o.parentKey=t.parentKey),t.parent&&(o.parent=JSON.parse(t.parent)),t.pb&&(o.processedBy=t.pb),t.nrjid&&(o.nextRepeatableJobId=t.nrjid),o}createScripts(){this.scripts=(0,o.createScripts)(this.queue)}static optsFromJSON(e,t=i.optsDecodeMap){let r=JSON.parse(e||"{}"),n=Object.entries(r),a={};for(let e of n){let[r,n]=e;t[r]?a[t[r]]=n:"tm"===r?a.telemetry=Object.assign(Object.assign({},a.telemetry),{metadata:n}):"omc"===r?a.telemetry=Object.assign(Object.assign({},a.telemetry),{omitContext:n}):a[r]=n}return a}static async fromId(e,t){if(t){let r=await e.client,n=await r.hgetall(e.toKey(t));return(0,i.isEmpty)(n)?void 0:this.fromJSON(e,n,t)}}static addJobLog(e,t,r,n){let a=e.scripts;return a.addLog(t,r,n)}toJSON(){let{queue:e,scripts:t}=this,r=n.__rest(this,["queue","scripts"]);return r}asJSON(){return(0,i.removeUndefinedFields)({id:this.id,name:this.name,data:JSON.stringify(void 0===this.data?{}:this.data),opts:Job.optsAsJSON(this.opts),parent:this.parent?Object.assign({},this.parent):void 0,parentKey:this.parentKey,progress:this.progress,attemptsMade:this.attemptsMade,attemptsStarted:this.attemptsStarted,stalledCounter:this.stalledCounter,finishedOn:this.finishedOn,processedOn:this.processedOn,timestamp:this.timestamp,failedReason:JSON.stringify(this.failedReason),stacktrace:JSON.stringify(this.stacktrace),debounceId:this.debounceId,deduplicationId:this.deduplicationId,repeatJobKey:this.repeatJobKey,returnvalue:JSON.stringify(this.returnvalue),nrjid:this.nextRepeatableJobId})}static optsAsJSON(e={},t=i.optsEncodeMap){let r=Object.entries(e),n={};for(let[e,a]of r)if(void 0!==a){if(e in t){let r=t[e];n[r]=a}else"telemetry"===e?(void 0!==a.metadata&&(n.tm=a.metadata),void 0!==a.omitContext&&(n.omc=a.omitContext)):n[e]=a}return n}asJSONSandbox(){return Object.assign(Object.assign({},this.asJSON()),{queueName:this.queueName,queueQualifiedName:this.queueQualifiedName,prefix:this.prefix})}updateData(e){return this.data=e,this.scripts.updateData(this,e)}async updateProgress(e){this.progress=e,await this.scripts.updateProgress(this.id,e),this.queue.emit("progress",this,e)}async log(e){return Job.addJobLog(this.queue,this.id,e,this.opts.keepLogs)}async removeChildDependency(){let e=await this.scripts.removeChildDependency(this.id,this.parentKey);return!!e&&(this.parent=void 0,this.parentKey=void 0,!0)}async clearLogs(e){let t=await this.queue.client,r=this.toKey(this.id)+":logs";e?await t.ltrim(r,-e,-1):await t.del(r)}async remove({removeChildren:e=!0}={}){await this.queue.waitUntilReady();let t=this.queue,r=await this.scripts.remove(this.id,e);if(r)t.emit("removed",this);else throw Error(`Job ${this.id} could not be removed because it is locked by another worker`)}async removeUnprocessedChildren(){let e=this.id;await this.scripts.removeUnprocessedChildren(e)}extendLock(e,t){return this.scripts.extendLock(this.id,e,t)}async moveToCompleted(e,t,r=!0){return this.queue.trace(d.SpanKind.INTERNAL,"complete",this.queue.name,async(n,a)=>{var o,s;null===(s=null===(o=this.opts)||void 0===o?void 0:o.telemetry)||void 0===s||s.omitContext,await this.queue.waitUntilReady(),this.returnvalue=e||void 0;let l=(0,i.tryCatch)(JSON.stringify,JSON,[e]);if(l===i.errorObject)throw i.errorObject.value;let d=this.scripts.moveToCompletedArgs(this,l,this.opts.removeOnComplete,t,r),u=await this.scripts.moveToFinished(this.id,d);return this.finishedOn=d[this.scripts.moveToFinishedKeys.length+1],this.attemptsMade+=1,u})}moveToWait(e){return this.scripts.moveJobFromActiveToWait(this.id,e)}async shouldRetryJob(e){if(!(this.attemptsMade+1<this.opts.attempts)||this.discarded||e instanceof l.UnrecoverableError||"UnrecoverableError"==e.name)return[!1,0];{let t=this.queue.opts,r=await s.Backoffs.calculate(this.opts.backoff,this.attemptsMade+1,e,this,t.settings&&t.settings.backoffStrategy);return[-1!=r,-1==r?0:r]}}async moveToFailed(e,t,r=!1){this.failedReason=null==e?void 0:e.message;let[n,a]=await this.shouldRetryJob(e);return this.queue.trace(d.SpanKind.INTERNAL,this.getSpanOperation(n,a),this.queue.name,async(i,o)=>{var s,l;let d,u,c;(null===(l=null===(s=this.opts)||void 0===s?void 0:s.telemetry)||void 0===l?void 0:l.omitContext)||!o||(d=o),this.updateStacktrace(e);let p={failedReason:this.failedReason,stacktrace:JSON.stringify(this.stacktrace),tm:d};if(n)u=a?await this.scripts.moveToDelayed(this.id,Date.now(),a,t,{fieldsToUpdate:p}):await this.scripts.retryJob(this.id,this.opts.lifo,t,{fieldsToUpdate:p});else{let e=this.scripts.moveToFailedArgs(this,this.failedReason,this.opts.removeOnFail,t,r,p);u=await this.scripts.moveToFinished(this.id,e),c=e[this.scripts.moveToFinishedKeys.length+1]}return c&&"number"==typeof c&&(this.finishedOn=c),a&&"number"==typeof a&&(this.delay=a),this.attemptsMade+=1,u})}getSpanOperation(e,t){return e?t?"delay":"retry":"fail"}isCompleted(){return this.isInZSet("completed")}isFailed(){return this.isInZSet("failed")}isDelayed(){return this.isInZSet("delayed")}isWaitingChildren(){return this.isInZSet("waiting-children")}isActive(){return this.isInList("active")}async isWaiting(){return await this.isInList("wait")||await this.isInList("paused")}get queueName(){return this.queue.name}get prefix(){return this.queue.opts.prefix}getState(){return this.scripts.getState(this.id)}async changeDelay(e){await this.scripts.changeDelay(this.id,e),this.delay=e}async changePriority(e){await this.scripts.changePriority(this.id,e.priority,e.lifo),this.priority=e.priority||0}async getChildrenValues(){let e=await this.queue.client,t=await e.hgetall(this.toKey(`${this.id}:processed`));if(t)return(0,i.parseObjectValues)(t)}async getIgnoredChildrenFailures(){let e=await this.queue.client;return e.hgetall(this.toKey(`${this.id}:failed`))}async getFailedChildrenValues(){let e=await this.queue.client;return e.hgetall(this.toKey(`${this.id}:failed`))}async getDependencies(e={}){let t=await this.queue.client,r=t.multi();if(e.processed||e.unprocessed||e.ignored||e.failed){let t,n,a,i,o,s,l,d;let u={cursor:0,count:20},c=[];if(e.processed){c.push("processed");let t=Object.assign(Object.assign({},u),e.processed);r.hscan(this.toKey(`${this.id}:processed`),t.cursor,"COUNT",t.count)}if(e.unprocessed){c.push("unprocessed");let t=Object.assign(Object.assign({},u),e.unprocessed);r.sscan(this.toKey(`${this.id}:dependencies`),t.cursor,"COUNT",t.count)}if(e.ignored){c.push("ignored");let t=Object.assign(Object.assign({},u),e.ignored);r.hscan(this.toKey(`${this.id}:failed`),t.cursor,"COUNT",t.count)}if(e.failed){c.push("failed");let n=Object.assign(Object.assign({},u),e.failed);t=n.cursor+n.count,r.zrange(this.toKey(`${this.id}:unsuccessful`),n.cursor,n.count-1)}let p=await r.exec();return c.forEach((e,t)=>{switch(e){case"processed":{n=p[t][1][0];let e=p[t][1][1],r={};for(let t=0;t<e.length;++t)t%2&&(r[e[t-1]]=JSON.parse(e[t]));a=r;break}case"failed":s=p[t][1];break;case"ignored":{l=p[t][1][0];let e=p[t][1][1],r={};for(let t=0;t<e.length;++t)t%2&&(r[e[t-1]]=e[t]);d=r;break}case"unprocessed":i=p[t][1][0],o=p[t][1][1]}}),Object.assign(Object.assign(Object.assign(Object.assign({},n?{processed:a,nextProcessedCursor:Number(n)}:{}),l?{ignored:d,nextIgnoredCursor:Number(l)}:{}),t?{failed:s,nextFailedCursor:t}:{}),i?{unprocessed:o,nextUnprocessedCursor:Number(i)}:{})}{r.hgetall(this.toKey(`${this.id}:processed`)),r.smembers(this.toKey(`${this.id}:dependencies`)),r.hgetall(this.toKey(`${this.id}:failed`)),r.zrange(this.toKey(`${this.id}:unsuccessful`),0,-1);let[[e,t],[n,a],[o,s],[l,d]]=await r.exec();return{processed:(0,i.parseObjectValues)(t),unprocessed:a,failed:d,ignored:s}}}async getDependenciesCount(e={}){let t=[];Object.entries(e).forEach(([e,r])=>{r&&t.push(e)});let r=t.length?t:["processed","unprocessed","ignored","failed"],n=await this.scripts.getDependencyCounts(this.id,r),a={};return n.forEach((e,t)=>{a[`${r[t]}`]=e||0}),a}async waitUntilFinished(e,t){await this.queue.waitUntilReady();let r=this.id;return new Promise(async(n,a)=>{let i;function onCompleted(e){removeListeners(),n(e.returnvalue)}function onFailed(e){removeListeners(),a(Error(e.failedReason||e))}t&&(i=setTimeout(()=>onFailed(`Job wait ${this.name} timed out before finishing, no finish notification arrived after ${t}ms (id=${r})`),t));let o=`completed:${r}`,s=`failed:${r}`;e.on(o,onCompleted),e.on(s,onFailed),this.queue.on("closing",onFailed);let removeListeners=()=>{clearInterval(i),e.removeListener(o,onCompleted),e.removeListener(s,onFailed),this.queue.removeListener("closing",onFailed)};await e.waitUntilReady();let[l,d]=await this.scripts.isFinished(r,!0);0!=l&&(-1==l||2==l?onFailed({failedReason:d}):onCompleted({returnvalue:getReturnValue(d)}))})}async moveToDelayed(e,t){let r=Date.now(),n=e-r,a=n>0?n:0,i=await this.scripts.moveToDelayed(this.id,r,a,t,{skipAttempt:!0});return this.delay=a,i}async moveToWaitingChildren(e,t={}){let r=await this.scripts.moveToWaitingChildren(this.id,e,t);return r}async promote(){let e=this.id;await this.scripts.promote(e),this.delay=0}retry(e="failed"){return this.failedReason=null,this.finishedOn=null,this.processedOn=null,this.returnvalue=null,this.scripts.reprocessJob(this,e)}discard(){this.discarded=!0}async isInZSet(e){let t=await this.queue.client,r=await t.zscore(this.queue.toKey(e),this.id);return null!==r}async isInList(e){return this.scripts.isJobInList(this.queue.toKey(e),this.id)}addJob(e,t){let r=this.asJSON();return this.validateOptions(r),this.scripts.addJob(e,r,r.opts,this.id,t)}validateOptions(e){var r,n,a,o,s,l,d,u;let c=this.opts.sizeLimit&&(0,i.lengthInUtf8Bytes)(e.data)>this.opts.sizeLimit;if(c)throw Error(`The size of job ${this.name} exceeds the limit ${this.opts.sizeLimit} bytes`);if(this.opts.delay&&this.opts.repeat&&!(null===(r=this.opts.repeat)||void 0===r?void 0:r.count))throw Error("Delay and repeat options could not be used together");let p=["removeDependencyOnFailure","failParentOnFailure","continueParentOnFailure","ignoreDependencyOnFailure"].filter(e=>this.opts[e]);if(p.length>1){let e=p.join(", ");throw Error(`The following options cannot be used together: ${e}`)}if(null===(n=this.opts)||void 0===n?void 0:n.jobId){if(`${parseInt(this.opts.jobId,10)}`===(null===(a=this.opts)||void 0===a?void 0:a.jobId))throw Error("Custom Id cannot be integers");if((null===(o=this.opts)||void 0===o?void 0:o.jobId.includes(":"))&&(null===(l=null===(s=this.opts)||void 0===s?void 0:s.jobId)||void 0===l?void 0:l.split(":").length)!==3)throw Error("Custom Id cannot contain :")}if(this.opts.priority){if(Math.trunc(this.opts.priority)!==this.opts.priority)throw Error("Priority should not be float");if(this.opts.priority>t.PRIORITY_LIMIT)throw Error(`Priority should be between 0 and ${t.PRIORITY_LIMIT}`)}if(this.opts.deduplication&&!(null===(d=this.opts.deduplication)||void 0===d?void 0:d.id))throw Error("Deduplication id must be provided");if(this.opts.debounce&&!(null===(u=this.opts.debounce)||void 0===u?void 0:u.id))throw Error("Debounce id must be provided");if("object"==typeof this.opts.backoff&&"number"==typeof this.opts.backoff.jitter&&(this.opts.backoff.jitter<0||this.opts.backoff.jitter>1))throw Error("Jitter should be between 0 and 1")}updateStacktrace(e){this.stacktrace=this.stacktrace||[],(null==e?void 0:e.stack)&&(this.stacktrace.push(e.stack),0===this.opts.stackTraceLimit?this.stacktrace=[]:this.opts.stackTraceLimit&&(this.stacktrace=this.stacktrace.slice(-this.opts.stackTraceLimit)))}};function getReturnValue(e){let t=(0,i.tryCatch)(JSON.parse,JSON,[e]);if(t!==i.errorObject)return t;u("corrupted returnvalue: "+e,t)}t.Job=Job},33525:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LockManager=void 0;let n=r(90875);t.LockManager=class{constructor(e,t){this.worker=e,this.opts=t,this.trackedJobs=new Map,this.closed=!1}start(){!this.closed&&this.opts.lockRenewTime>0&&this.startLockExtenderTimer()}async extendLocks(e){await this.worker.trace(n.SpanKind.INTERNAL,"extendLocks",this.worker.name,async t=>{null==t||t.setAttributes({[n.TelemetryAttributes.WorkerId]:this.opts.workerId,[n.TelemetryAttributes.WorkerName]:this.opts.workerName,[n.TelemetryAttributes.WorkerJobsToExtendLocks]:e});try{let t=e.map(e=>{var t;return(null===(t=this.trackedJobs.get(e))||void 0===t?void 0:t.token)||""}),r=await this.worker.extendJobLocks(e,t,this.opts.lockDuration);if(r.length>0)for(let e of(this.worker.emit("lockRenewalFailed",r),r))this.worker.emit("error",Error(`could not renew lock for job ${e}`));let n=e.filter(e=>!r.includes(e));n.length>0&&this.worker.emit("locksRenewed",{count:n.length,jobIds:n})}catch(e){this.worker.emit("error",e)}})}startLockExtenderTimer(){clearTimeout(this.lockRenewalTimer),this.closed||(this.lockRenewalTimer=setTimeout(async()=>{let e=Date.now(),t=[];for(let r of this.trackedJobs.keys()){let{ts:n,token:a}=this.trackedJobs.get(r);if(!n){this.trackedJobs.set(r,{token:a,ts:e});continue}n+this.opts.lockRenewTime/2<e&&(this.trackedJobs.set(r,{token:a,ts:e}),t.push(r))}t.length&&await this.extendLocks(t),this.startLockExtenderTimer()},this.opts.lockRenewTime/2))}async close(){this.closed||(this.closed=!0,this.lockRenewalTimer&&(clearTimeout(this.lockRenewalTimer),this.lockRenewalTimer=void 0),this.trackedJobs.clear())}trackJob(e,t,r){!this.closed&&e&&this.trackedJobs.set(e,{token:t,ts:r})}untrackJob(e){this.trackedJobs.delete(e)}getActiveJobCount(){return this.trackedJobs.size}isRunning(){return!this.closed&&void 0!==this.lockRenewalTimer}}},94533:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.QueueBase=void 0;let n=r(82361),a=r(2394),i=r(57669),o=r(244),s=r(96596),l=r(97503);let QueueBase=class QueueBase extends n.EventEmitter{constructor(e,t={connection:{}},r=o.RedisConnection,n=!1){if(super(),this.name=e,this.opts=t,this.closed=!1,this.hasBlockingConnection=!1,this.hasBlockingConnection=n,this.opts=Object.assign({prefix:"bull"},t),!e)throw Error("Queue name must be provided");if(e.includes(":"))throw Error("Queue name cannot contain :");this.connection=new r(t.connection,{shared:(0,a.isRedisInstance)(t.connection),blocking:n,skipVersionCheck:t.skipVersionCheck,skipWaitingForReady:t.skipWaitingForReady}),this.connection.on("error",e=>this.emit("error",e)),this.connection.on("close",()=>{this.closing||this.emit("ioredis:close")});let i=new l.QueueKeys(t.prefix);this.qualifiedName=i.getQueueQualifiedName(e),this.keys=i.getKeys(e),this.toKey=t=>i.toKey(e,t),this.createScripts()}get client(){return this.connection.client}createScripts(){this.scripts=(0,i.createScripts)(this)}get redisVersion(){return this.connection.redisVersion}get Job(){return s.Job}emit(e,...t){try{return super.emit(e,...t)}catch(e){try{return super.emit("error",e)}catch(e){return console.error(e),!1}}}waitUntilReady(){return this.client}base64Name(){return Buffer.from(this.name).toString("base64")}clientName(e=""){let t=this.base64Name();return`${this.opts.prefix}:${t}${e}`}async close(){this.closing||(this.closing=this.connection.close()),await this.closing,this.closed=!0}disconnect(){return this.connection.disconnect()}async checkConnectionError(e,t=a.DELAY_TIME_5){try{return await e()}catch(e){if((0,a.isNotConnectionError)(e)&&this.emit("error",e),this.closing||!t)return;await (0,a.delay)(t)}}trace(e,t,r,n,i){return(0,a.trace)(this.opts.telemetry,e,this.name,t,r,n,i)}};t.QueueBase=QueueBase},38725:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.QueueEventsProducer=void 0;let n=r(87175),a=r(94533);let QueueEventsProducer=class QueueEventsProducer extends a.QueueBase{constructor(e,t={connection:{}},r){super(e,Object.assign({blockingConnection:!1},t),r),this.opts=t}async publishEvent(e,t=1e3){let r=await this.client,a=this.keys.events,{eventName:i}=e,o=n.__rest(e,["eventName"]),s=["MAXLEN","~",t,"*","event",i];for(let[e,t]of Object.entries(o))s.push(e,t);await r.xadd(a,...s)}async close(){this.closing||(this.closing=this.connection.close()),await this.closing}};t.QueueEventsProducer=QueueEventsProducer},21918:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.QueueEvents=void 0;let n=r(87175),a=r(2394),i=r(94533);let QueueEvents=class QueueEvents extends i.QueueBase{constructor(e,t={connection:{}},r){var{connection:i,autorun:o=!0}=t;super(e,Object.assign(Object.assign({},n.__rest(t,["connection","autorun"])),{connection:(0,a.isRedisInstance)(i)?i.duplicate():i}),r,!0),this.running=!1,this.opts=Object.assign({blockingTimeout:1e4},this.opts),o&&this.run().catch(e=>this.emit("error",e))}emit(e,...t){return super.emit(e,...t)}off(e,t){return super.off(e,t),this}on(e,t){return super.on(e,t),this}once(e,t){return super.once(e,t),this}async run(){if(this.running)throw Error("Queue Events is already running.");try{this.running=!0;let e=await this.client;try{await e.client("SETNAME",this.clientName(a.QUEUE_EVENT_SUFFIX))}catch(e){if(!a.clientCommandMessageReg.test(e.message))throw e}await this.consumeEvents(e)}catch(e){throw this.running=!1,e}}async consumeEvents(e){let t=this.opts,r=this.keys.events,i=t.lastEventId||"$";for(;!this.closing;){let o=await this.checkConnectionError(()=>e.xread("BLOCK",t.blockingTimeout,"STREAMS",r,i));if(o){let e=o[0],t=e[1];for(let e=0;e<t.length;e++){i=t[e][0];let r=(0,a.array2obj)(t[e][1]);switch(r.event){case"progress":r.data=JSON.parse(r.data);break;case"completed":r.returnvalue=JSON.parse(r.returnvalue)}let{event:o}=r,s=n.__rest(r,["event"]);"drained"===o?this.emit(o,i):(this.emit(o,s,i),s.jobId&&this.emit(`${o}:${s.jobId}`,s,i))}}}}close(){return this.closing||(this.closing=this.disconnect()),this.closing}};t.QueueEvents=QueueEvents},49416:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.QueueGetters=void 0;let n=r(87175),a=r(94533),i=r(2394);let QueueGetters=class QueueGetters extends a.QueueBase{getJob(e){return this.Job.fromId(this,e)}commandByType(e,t,r){return e.map(e=>{e="waiting"===e?"wait":e;let n=this.toKey(e);switch(e){case"completed":case"failed":case"delayed":case"prioritized":case"repeat":case"waiting-children":return r(n,t?"zcard":"zrange");case"active":case"wait":case"paused":return r(n,t?"llen":"lrange")}})}sanitizeJobTypes(e){let t="string"==typeof e?[e]:e;if(Array.isArray(t)&&t.length>0){let e=[...t];return -1!==e.indexOf("waiting")&&e.push("paused"),[...new Set(e)]}return["active","completed","delayed","failed","paused","prioritized","waiting","waiting-children"]}async count(){let e=await this.getJobCountByTypes("waiting","paused","delayed","prioritized","waiting-children");return e}async getRateLimitTtl(e){return this.scripts.getRateLimitTtl(e)}async getDebounceJobId(e){let t=await this.client;return t.get(`${this.keys.de}:${e}`)}async getDeduplicationJobId(e){let t=await this.client;return t.get(`${this.keys.de}:${e}`)}async getGlobalConcurrency(){let e=await this.client,t=await e.hget(this.keys.meta,"concurrency");return t?Number(t):null}async getGlobalRateLimit(){let e=await this.client,[t,r]=await e.hmget(this.keys.meta,"max","duration");return t&&r?{max:Number(t),duration:Number(r)}:null}async getJobCountByTypes(...e){let t=await this.getJobCounts(...e);return Object.values(t).reduce((e,t)=>e+t,0)}async getJobCounts(...e){let t=this.sanitizeJobTypes(e),r=await this.scripts.getCounts(t),n={};return r.forEach((e,r)=>{n[t[r]]=e||0}),n}getJobState(e){return this.scripts.getState(e)}async getMeta(){let e=await this.client,t=await e.hgetall(this.keys.meta),{concurrency:r,max:a,duration:i,paused:o,"opts.maxLenEvents":s}=t,l=n.__rest(t,["concurrency","max","duration","paused","opts.maxLenEvents"]);return r&&(l.concurrency=Number(r)),s&&(l.maxLenEvents=Number(s)),a&&(l.max=Number(a)),i&&(l.duration=Number(i)),l.paused="1"===o,l}getCompletedCount(){return this.getJobCountByTypes("completed")}getFailedCount(){return this.getJobCountByTypes("failed")}getDelayedCount(){return this.getJobCountByTypes("delayed")}getActiveCount(){return this.getJobCountByTypes("active")}getPrioritizedCount(){return this.getJobCountByTypes("prioritized")}async getCountsPerPriority(e){let t=[...new Set(e)],r=await this.scripts.getCountsPerPriority(t),n={};return r.forEach((e,r)=>{n[`${t[r]}`]=e||0}),n}getWaitingCount(){return this.getJobCountByTypes("waiting")}getWaitingChildrenCount(){return this.getJobCountByTypes("waiting-children")}getWaiting(e=0,t=-1){return this.getJobs(["waiting"],e,t,!0)}getWaitingChildren(e=0,t=-1){return this.getJobs(["waiting-children"],e,t,!0)}getActive(e=0,t=-1){return this.getJobs(["active"],e,t,!0)}getDelayed(e=0,t=-1){return this.getJobs(["delayed"],e,t,!0)}getPrioritized(e=0,t=-1){return this.getJobs(["prioritized"],e,t,!0)}getCompleted(e=0,t=-1){return this.getJobs(["completed"],e,t,!1)}getFailed(e=0,t=-1){return this.getJobs(["failed"],e,t,!1)}async getDependencies(e,t,r,n){let a=this.toKey("processed"==t?`${e}:processed`:`${e}:dependencies`),{items:i,total:o,jobs:s}=await this.scripts.paginate(a,{start:r,end:n,fetchJobs:!0});return{items:i,jobs:s,total:o}}async getRanges(e,t=0,r=1,n=!1){let a=[];this.commandByType(e,!1,(e,t)=>{switch(t){case"lrange":a.push("lrange");break;case"zrange":a.push("zrange")}});let i=await this.scripts.getRanges(e,t,r,n),o=[];return i.forEach((e,t)=>{let r=e||[];o=n&&"lrange"===a[t]?o.concat(r.reverse()):o.concat(r)}),[...new Set(o)]}async getJobs(e,t=0,r=-1,n=!1){let a=this.sanitizeJobTypes(e),i=await this.getRanges(a,t,r,n);return Promise.all(i.map(e=>this.Job.fromId(this,e)))}async getJobLogs(e,t=0,r=-1,n=!0){let a=await this.client,i=a.multi(),o=this.toKey(e+":logs");n?i.lrange(o,t,r):i.lrange(o,-(r+1),-(t+1)),i.llen(o);let s=await i.exec();return n||s[0][1].reverse(),{logs:s[0][1],count:s[1][1]}}async baseGetClients(e){let t=await this.client;try{let r=await t.client("LIST"),n=this.parseClientList(r,e);return n}catch(e){if(!i.clientCommandMessageReg.test(e.message))throw e;return[{name:"GCP does not support client list"}]}}getWorkers(){let e=`${this.clientName()}`,t=`${this.clientName()}:w:`;return this.baseGetClients(r=>r&&(r===e||r.startsWith(t)))}async getWorkersCount(){let e=await this.getWorkers();return e.length}async getQueueEvents(){let e=`${this.clientName()}${i.QUEUE_EVENT_SUFFIX}`;return this.baseGetClients(t=>t===e)}async getMetrics(e,t=0,r=-1){let[n,a,i]=await this.scripts.getMetrics(e,t,r);return{meta:{count:parseInt(n[0]||"0",10),prevTS:parseInt(n[1]||"0",10),prevCount:parseInt(n[2]||"0",10)},data:a.map(e=>+e||0),count:i}}parseClientList(e,t){let r=e.split(/\r?\n/),n=[];return r.forEach(e=>{let r={},a=e.split(" ");a.forEach(function(e){let t=e.indexOf("="),n=e.substring(0,t),a=e.substring(t+1);r[n]=a});let i=r.name;t(i)&&(r.name=this.name,r.rawname=i,n.push(r))}),n}async exportPrometheusMetrics(e){let t=await this.getJobCounts(),r=[];r.push("# HELP bullmq_job_count Number of jobs in the queue by state"),r.push("# TYPE bullmq_job_count gauge");let n=e?Object.keys(e).reduce((t,r)=>`${t}, ${r}="${e[r]}"`,""):"";for(let[e,a]of Object.entries(t))r.push(`bullmq_job_count{queue="${this.name}", state="${e}"${n}} ${a}`);return r.join("\n")}};t.QueueGetters=QueueGetters},97503:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.QueueKeys=void 0,t.QueueKeys=class{constructor(e="bull"){this.prefix=e}getKeys(e){let t={};return["","active","wait","waiting-children","paused","id","delayed","prioritized","stalled-check","completed","failed","stalled","repeat","limiter","meta","events","pc","marker","de"].forEach(r=>{t[r]=this.toKey(e,r)}),t}toKey(e,t){return`${this.getQueueQualifiedName(e)}:${t}`}getQueueQualifiedName(e){return`${this.prefix}:${e}`}}},82759:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Queue=void 0;let n=r(9925),a=r(96596),i=r(49416),o=r(55587),s=r(90875),l=r(69550),d=r(94068);let Queue=class Queue extends i.QueueGetters{constructor(e,t,r){var a;super(e,Object.assign({},t),r),this.token=(0,n.v4)(),this.libName="bullmq",this.jobsOpts=null!==(a=null==t?void 0:t.defaultJobOptions)&&void 0!==a?a:{},this.waitUntilReady().then(e=>{if(!this.closing&&!(null==t?void 0:t.skipMetasUpdate))return e.hmset(this.keys.meta,this.metaValues)}).catch(e=>{})}emit(e,...t){return super.emit(e,...t)}off(e,t){return super.off(e,t),this}on(e,t){return super.on(e,t),this}once(e,t){return super.once(e,t),this}get defaultJobOptions(){return Object.assign({},this.jobsOpts)}get metaValues(){var e,t,r,n;return{"opts.maxLenEvents":null!==(n=null===(r=null===(t=null===(e=this.opts)||void 0===e?void 0:e.streams)||void 0===t?void 0:t.events)||void 0===r?void 0:r.maxLen)&&void 0!==n?n:1e4,version:`${this.libName}:${d.version}`}}async getVersion(){let e=await this.client;return await e.hget(this.keys.meta,"version")}get repeat(){return new Promise(async e=>{this._repeat||(this._repeat=new o.Repeat(this.name,Object.assign(Object.assign({},this.opts),{connection:await this.client})),this._repeat.on("error",e=>this.emit.bind(this,e))),e(this._repeat)})}get jobScheduler(){return new Promise(async e=>{this._jobScheduler||(this._jobScheduler=new l.JobScheduler(this.name,Object.assign(Object.assign({},this.opts),{connection:await this.client})),this._jobScheduler.on("error",e=>this.emit.bind(this,e))),e(this._jobScheduler)})}async setGlobalConcurrency(e){let t=await this.client;return t.hset(this.keys.meta,"concurrency",e)}async setGlobalRateLimit(e,t){let r=await this.client;return r.hset(this.keys.meta,"max",e,"duration",t)}async removeGlobalConcurrency(){let e=await this.client;return e.hdel(this.keys.meta,"concurrency")}async removeGlobalRateLimit(){let e=await this.client;return e.hdel(this.keys.meta,"max","duration")}async add(e,t,r){return this.trace(s.SpanKind.PRODUCER,"add",`${this.name}.${e}`,async(n,a)=>{var i;!a||(null===(i=null==r?void 0:r.telemetry)||void 0===i?void 0:i.omitContext)||(r=Object.assign(Object.assign({},r),{telemetry:{metadata:a}}));let o=await this.addJob(e,t,r);return null==n||n.setAttributes({[s.TelemetryAttributes.JobName]:e,[s.TelemetryAttributes.JobId]:o.id}),o})}async addJob(e,t,r){if(r&&r.repeat){if(r.repeat.endDate&&+new Date(r.repeat.endDate)<Date.now())throw Error("End date must be greater than current timestamp");return(await this.repeat).updateRepeatableJob(e,t,Object.assign(Object.assign({},this.jobsOpts),r),{override:!0})}{let n=null==r?void 0:r.jobId;if("0"==n||(null==n?void 0:n.startsWith("0:")))throw Error("JobId cannot be '0' or start with 0:");let a=await this.Job.create(this,e,t,Object.assign(Object.assign(Object.assign({},this.jobsOpts),r),{jobId:n}));return this.emit("waiting",a),a}}async addBulk(e){return this.trace(s.SpanKind.PRODUCER,"addBulk",this.name,async(t,r)=>(t&&t.setAttributes({[s.TelemetryAttributes.BulkNames]:e.map(e=>e.name),[s.TelemetryAttributes.BulkCount]:e.length}),await this.Job.createBulk(this,e.map(e=>{var t,n,a,i,o,s;let l=null===(t=e.opts)||void 0===t?void 0:t.telemetry;if(r){let t=null===(a=null===(n=e.opts)||void 0===n?void 0:n.telemetry)||void 0===a?void 0:a.omitContext,s=(null===(o=null===(i=e.opts)||void 0===i?void 0:i.telemetry)||void 0===o?void 0:o.metadata)||!t&&r;(s||t)&&(l={metadata:s,omitContext:t})}return{name:e.name,data:e.data,opts:Object.assign(Object.assign(Object.assign({},this.jobsOpts),e.opts),{jobId:null===(s=e.opts)||void 0===s?void 0:s.jobId,telemetry:l})}}))))}async upsertJobScheduler(e,t,r){var n,a;if(t.endDate&&+new Date(t.endDate)<Date.now())throw Error("End date must be greater than current timestamp");return(await this.jobScheduler).upsertJobScheduler(e,t,null!==(n=null==r?void 0:r.name)&&void 0!==n?n:e,null!==(a=null==r?void 0:r.data)&&void 0!==a?a:{},Object.assign(Object.assign({},this.jobsOpts),null==r?void 0:r.opts),{override:!0})}async pause(){await this.trace(s.SpanKind.INTERNAL,"pause",this.name,async()=>{await this.scripts.pause(!0),this.emit("paused")})}async close(){await this.trace(s.SpanKind.INTERNAL,"close",this.name,async()=>{!this.closing&&this._repeat&&await this._repeat.close(),await super.close()})}async rateLimit(e){await this.trace(s.SpanKind.INTERNAL,"rateLimit",this.name,async t=>{null==t||t.setAttributes({[s.TelemetryAttributes.QueueRateLimit]:e}),await this.client.then(t=>t.set(this.keys.limiter,Number.MAX_SAFE_INTEGER,"PX",e))})}async resume(){await this.trace(s.SpanKind.INTERNAL,"resume",this.name,async()=>{await this.scripts.pause(!1),this.emit("resumed")})}async isPaused(){let e=await this.client,t=await e.hexists(this.keys.meta,"paused");return 1===t}isMaxed(){return this.scripts.isMaxed()}async getRepeatableJobs(e,t,r){return(await this.repeat).getRepeatableJobs(e,t,r)}async getJobScheduler(e){return(await this.jobScheduler).getScheduler(e)}async getJobSchedulers(e,t,r){return(await this.jobScheduler).getJobSchedulers(e,t,r)}async getJobSchedulersCount(){return(await this.jobScheduler).getSchedulersCount()}async removeRepeatable(e,t,r){return this.trace(s.SpanKind.INTERNAL,"removeRepeatable",`${this.name}.${e}`,async n=>{null==n||n.setAttributes({[s.TelemetryAttributes.JobName]:e,[s.TelemetryAttributes.JobId]:r});let a=await this.repeat,i=await a.removeRepeatable(e,t,r);return!i})}async removeJobScheduler(e){let t=await this.jobScheduler,r=await t.removeJobScheduler(e);return!r}async removeDebounceKey(e){return this.trace(s.SpanKind.INTERNAL,"removeDebounceKey",`${this.name}`,async t=>{null==t||t.setAttributes({[s.TelemetryAttributes.JobKey]:e});let r=await this.client;return await r.del(`${this.keys.de}:${e}`)})}async removeDeduplicationKey(e){return this.trace(s.SpanKind.INTERNAL,"removeDeduplicationKey",`${this.name}`,async t=>{null==t||t.setAttributes({[s.TelemetryAttributes.DeduplicationKey]:e});let r=await this.client;return r.del(`${this.keys.de}:${e}`)})}async removeRateLimitKey(){let e=await this.client;return e.del(this.keys.limiter)}async removeRepeatableByKey(e){return this.trace(s.SpanKind.INTERNAL,"removeRepeatableByKey",`${this.name}`,async t=>{null==t||t.setAttributes({[s.TelemetryAttributes.JobKey]:e});let r=await this.repeat,n=await r.removeRepeatableByKey(e);return!n})}async remove(e,{removeChildren:t=!0}={}){return this.trace(s.SpanKind.INTERNAL,"remove",this.name,async r=>{null==r||r.setAttributes({[s.TelemetryAttributes.JobId]:e,[s.TelemetryAttributes.JobOptions]:JSON.stringify({removeChildren:t})});let n=await this.scripts.remove(e,t);return 1===n&&this.emit("removed",e),n})}async updateJobProgress(e,t){await this.trace(s.SpanKind.INTERNAL,"updateJobProgress",this.name,async r=>{null==r||r.setAttributes({[s.TelemetryAttributes.JobId]:e,[s.TelemetryAttributes.JobProgress]:JSON.stringify(t)}),await this.scripts.updateProgress(e,t),this.emit("progress",e,t)})}async addJobLog(e,t,r){return a.Job.addJobLog(this,e,t,r)}async drain(e=!1){await this.trace(s.SpanKind.INTERNAL,"drain",this.name,async t=>{null==t||t.setAttributes({[s.TelemetryAttributes.QueueDrainDelay]:e}),await this.scripts.drain(e)})}async clean(e,t,r="completed"){return this.trace(s.SpanKind.INTERNAL,"clean",this.name,async n=>{let a=t||1/0,i=Math.min(1e4,a),o=Date.now()-e,l=0,d=[],u="waiting"===r?"wait":r;for(;l<a;){let e=await this.scripts.cleanJobsInSet(u,o,i);if(this.emit("cleaned",e,u),l+=e.length,d.push(...e),e.length<i)break}return null==n||n.setAttributes({[s.TelemetryAttributes.QueueGrace]:e,[s.TelemetryAttributes.JobType]:r,[s.TelemetryAttributes.QueueCleanLimit]:a,[s.TelemetryAttributes.JobIds]:d}),d})}async obliterate(e){await this.trace(s.SpanKind.INTERNAL,"obliterate",this.name,async()=>{await this.pause();let t=0;do t=await this.scripts.obliterate(Object.assign({force:!1,count:1e3},e));while(t)})}async retryJobs(e={}){await this.trace(s.SpanKind.PRODUCER,"retryJobs",this.name,async t=>{null==t||t.setAttributes({[s.TelemetryAttributes.QueueOptions]:JSON.stringify(e)});let r=0;do r=await this.scripts.retryJobs(e.state,e.count,e.timestamp);while(r)})}async promoteJobs(e={}){await this.trace(s.SpanKind.INTERNAL,"promoteJobs",this.name,async t=>{null==t||t.setAttributes({[s.TelemetryAttributes.QueueOptions]:JSON.stringify(e)});let r=0;do r=await this.scripts.promoteJobs(e.count);while(r)})}async trimEvents(e){return this.trace(s.SpanKind.INTERNAL,"trimEvents",this.name,async t=>{null==t||t.setAttributes({[s.TelemetryAttributes.QueueEventMaxLength]:e});let r=await this.client;return await r.xtrim(this.keys.events,"MAXLEN","~",e)})}async removeDeprecatedPriorityKey(){let e=await this.client;return e.del(this.toKey("priority"))}};t.Queue=Queue},244:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RedisConnection=void 0;let n=r(87175),a=r(82361),i=r(26277),o=r(27132),s=r(2394),l=r(94068),d=r(61114);let RedisConnection=class RedisConnection extends a.EventEmitter{constructor(e,t){if(super(),this.extraOptions=t,this.capabilities={canDoubleTimeout:!1,canBlockFor1Ms:!0},this.status="initializing",this.packageVersion=l.version,this.extraOptions=Object.assign({shared:!1,blocking:!0,skipVersionCheck:!1,skipWaitingForReady:!1},t),(0,s.isRedisInstance)(e)){if(this._client=e,this._client.options.keyPrefix)throw Error("BullMQ: ioredis does not support ioredis prefixes, use the prefix option instead.");(0,s.isRedisCluster)(this._client)?this.opts=this._client.options.redisOptions:this.opts=this._client.options,this.checkBlockingOptions("BullMQ: Your redis options maxRetriesPerRequest must be null.",this.opts,!0)}else this.checkBlockingOptions("BullMQ: WARNING! Your redis options maxRetriesPerRequest must be null and will be overridden by BullMQ.",e),this.opts=Object.assign({port:6379,host:"127.0.0.1",retryStrategy:function(e){return Math.max(Math.min(Math.exp(e),2e4),1e3)}},e),this.extraOptions.blocking&&(this.opts.maxRetriesPerRequest=null);this.skipVersionCheck=(null==t?void 0:t.skipVersionCheck)||!!(this.opts&&this.opts.skipVersionCheck),this.handleClientError=e=>{this.emit("error",e)},this.handleClientClose=()=>{this.emit("close")},this.handleClientReady=()=>{this.emit("ready")},this.initializing=this.init(),this.initializing.catch(e=>this.emit("error",e))}checkBlockingOptions(e,t,r=!1){if(this.extraOptions.blocking&&t&&t.maxRetriesPerRequest){if(r)throw Error(e);console.error(e)}}static async waitUntilReady(e){let t,r,n;if("ready"!==e.status){if("wait"===e.status)return e.connect();if("end"===e.status)throw Error(o.CONNECTION_CLOSED_ERROR_MSG);try{await new Promise((a,i)=>{let l;n=e=>{l=e},t=()=>{a()},r=()=>{"end"!==e.status?i(l||Error(o.CONNECTION_CLOSED_ERROR_MSG)):l?i(l):a()},(0,s.increaseMaxListeners)(e,3),e.once("ready",t),e.on("end",r),e.once("error",n)})}finally{e.removeListener("end",r),e.removeListener("error",n),e.removeListener("ready",t),(0,s.decreaseMaxListeners)(e,3)}}}get client(){return this.initializing}loadCommands(e,t){let r=t||d;for(let t in r){let n=`${r[t].name}:${e}`;this._client[n]||this._client.defineCommand(n,{numberOfKeys:r[t].keys,lua:r[t].content})}}async init(){if(!this._client){let e=this.opts,{url:t}=e,r=n.__rest(e,["url"]);this._client=t?new i.default(t,r):new i.default(r)}if((0,s.increaseMaxListeners)(this._client,3),this._client.on("error",this.handleClientError),this._client.on("close",this.handleClientClose),this._client.on("ready",this.handleClientReady),this.extraOptions.skipWaitingForReady||await RedisConnection.waitUntilReady(this._client),this.loadCommands(this.packageVersion),"end"!==this._client.status){if(this.version=await this.getRedisVersion(),!0!==this.skipVersionCheck&&!this.closing){if((0,s.isRedisVersionLowerThan)(this.version,RedisConnection.minimumVersion))throw Error(`Redis version needs to be greater or equal than ${RedisConnection.minimumVersion} Current: ${this.version}`);(0,s.isRedisVersionLowerThan)(this.version,RedisConnection.recommendedMinimumVersion)&&console.warn(`It is highly recommended to use a minimum Redis version of ${RedisConnection.recommendedMinimumVersion}
             Current: ${this.version}`)}this.capabilities={canDoubleTimeout:!(0,s.isRedisVersionLowerThan)(this.version,"6.0.0"),canBlockFor1Ms:!(0,s.isRedisVersionLowerThan)(this.version,"7.0.8")},this.status="ready"}return this._client}async disconnect(e=!0){let t=await this.client;if("end"!==t.status){let r,n;if(!e)return t.disconnect();let a=new Promise((e,a)=>{(0,s.increaseMaxListeners)(t,2),t.once("end",e),t.once("error",a),r=e,n=a});t.disconnect();try{await a}finally{(0,s.decreaseMaxListeners)(t,2),t.removeListener("end",r),t.removeListener("error",n)}}}async reconnect(){let e=await this.client;return e.connect()}async close(e=!1){if(!this.closing){let t=this.status;this.status="closing",this.closing=!0;try{"ready"===t&&await this.initializing,this.extraOptions.shared||("initializing"==t||e?this._client.disconnect():await this._client.quit(),this._client.status="end")}catch(e){if((0,s.isNotConnectionError)(e))throw e}finally{this._client.off("error",this.handleClientError),this._client.off("close",this.handleClientClose),this._client.off("ready",this.handleClientReady),(0,s.decreaseMaxListeners)(this._client,3),this.removeAllListeners(),this.status="closed"}}}async getRedisVersion(){let e;if(this.skipVersionCheck)return RedisConnection.minimumVersion;let t=await this._client.info(),r="redis_version:",n="maxmemory_policy:",a=t.split(/\r?\n/);for(let t=0;t<a.length;t++){if(0===a[t].indexOf(n)){let e=a[t].substr(n.length);"noeviction"!==e&&console.warn(`IMPORTANT! Eviction policy is ${e}. It should be "noeviction"`)}0===a[t].indexOf(r)&&(e=a[t].substr(r.length))}return e}get redisVersion(){return this.version}};t.RedisConnection=RedisConnection,RedisConnection.minimumVersion="5.0.0",RedisConnection.recommendedMinimumVersion="6.2.0"},55587:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getNextMillis=t.Repeat=void 0;let n=r(87175),a=r(96716),i=r(6113),o=r(94533);let Repeat=class Repeat extends o.QueueBase{constructor(e,r,n){super(e,r,n),this.repeatStrategy=r.settings&&r.settings.repeatStrategy||t.getNextMillis,this.repeatKeyHashAlgorithm=r.settings&&r.settings.repeatKeyHashAlgorithm||"md5"}async updateRepeatableJob(e,t,r,{override:a}){var i,o;let s=Object.assign({},r.repeat);null!==(i=s.pattern)&&void 0!==i||(s.pattern=s.cron),delete s.cron;let l=s.count?s.count+1:1;if(void 0!==s.limit&&l>s.limit)return;let d=Date.now(),{endDate:u}=s;if(u&&d>new Date(u).getTime())return;let c=r.prevMillis||0;d=c<d?d:c;let p=await this.repeatStrategy(d,s,e),{every:y,pattern:m}=s,h=!!((y||m)&&s.immediately),f=h&&y?d-p:void 0;if(p){let i;!c&&r.jobId&&(s.jobId=r.jobId);let d=getRepeatConcatOptions(e,s),b=null!==(o=r.repeat.key)&&void 0!==o?o:this.hash(d);if(a)i=await this.scripts.addRepeatableJob(b,p,{name:e,endDate:u?new Date(u).getTime():void 0,tz:s.tz,pattern:m,every:y},d);else{let e=await this.client;i=await this.scripts.updateRepeatableJobMillis(e,b,p,d)}let{immediately:K}=s,g=n.__rest(s,["immediately"]);return this.createNextJob(e,p,i,Object.assign(Object.assign({},r),{repeat:Object.assign({offset:f},g)}),t,l,h)}}async createNextJob(e,t,r,n,a,i,o){let s=this.getRepeatJobKey(e,t,r,a),l=Date.now(),d=t+(n.repeat.offset?n.repeat.offset:0)-l,u=Object.assign(Object.assign({},n),{jobId:s,delay:d<0||o?0:d,timestamp:l,prevMillis:t,repeatJobKey:r});return u.repeat=Object.assign(Object.assign({},n.repeat),{count:i}),this.Job.create(this,e,a,u)}getRepeatJobKey(e,t,r,n){return r.split(":").length>2?this.getRepeatJobId({name:e,nextMillis:t,namespace:this.hash(r),jobId:null==n?void 0:n.id}):this.getRepeatDelayedJobId({customKey:r,nextMillis:t})}async removeRepeatable(e,t,r){var n;let a=getRepeatConcatOptions(e,Object.assign(Object.assign({},t),{jobId:r})),i=null!==(n=t.key)&&void 0!==n?n:this.hash(a),o=this.getRepeatJobId({name:e,nextMillis:"",namespace:this.hash(a),jobId:null!=r?r:t.jobId,key:t.key});return this.scripts.removeRepeatable(o,a,i)}async removeRepeatableByKey(e){let t=this.keyToData(e),r=this.getRepeatJobId({name:t.name,nextMillis:"",namespace:this.hash(e),jobId:t.id});return this.scripts.removeRepeatable(r,"",e)}async getRepeatableData(e,t,r){let n=await e.hgetall(this.toKey("repeat:"+t));return n?{key:t,name:n.name,endDate:parseInt(n.endDate)||null,tz:n.tz||null,pattern:n.pattern||null,every:n.every||null,next:r}:this.keyToData(t,r)}keyToData(e,t){let r=e.split(":"),n=r.slice(4).join(":")||null;return{key:e,name:r[0],id:r[1]||null,endDate:parseInt(r[2])||null,tz:r[3]||null,pattern:n,next:t}}async getRepeatableJobs(e=0,t=-1,r=!1){let n=await this.client,a=this.keys.repeat,i=r?await n.zrange(a,e,t,"WITHSCORES"):await n.zrevrange(a,e,t,"WITHSCORES"),o=[];for(let e=0;e<i.length;e+=2)o.push(this.getRepeatableData(n,i[e],parseInt(i[e+1])));return Promise.all(o)}async getRepeatableCount(){let e=await this.client;return e.zcard(this.toKey("repeat"))}hash(e){return(0,i.createHash)(this.repeatKeyHashAlgorithm).update(e).digest("hex")}getRepeatDelayedJobId({nextMillis:e,customKey:t}){return`repeat:${t}:${e}`}getRepeatJobId({name:e,nextMillis:t,namespace:r,jobId:n,key:a}){let i=null!=a?a:this.hash(`${e}${n||""}${r}`);return`repeat:${i}:${t}`}};function getRepeatConcatOptions(e,t){let r=t.endDate?new Date(t.endDate).getTime():"",n=t.tz||"",a=t.pattern,i=a||String(t.every)||"",o=t.jobId?t.jobId:"";return`${e}:${o}:${r}:${n}:${i}`}t.Repeat=Repeat,t.getNextMillis=(e,t)=>{let r=t.pattern;if(r&&t.every)throw Error("Both .pattern and .every options are defined for this repeatable job");if(t.every)return Math.floor(e/t.every)*t.every+(t.immediately?0:t.every);let n=new Date(t.startDate&&new Date(t.startDate)>new Date(e)?t.startDate:e),i=(0,a.parseExpression)(r,Object.assign(Object.assign({},t),{currentDate:n}));try{if(t.immediately)return new Date().getTime();return i.next().getTime()}catch(e){}}},43754:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(90875);t.default=(e,t)=>async function(r,a){let i,o,s;try{let l=new Promise((l,d)=>{let initChild=async()=>{try{s=(e,t)=>{d(Error("Unexpected exit code: "+e+" signal: "+t))},(i=await t.retain(e)).on("exit",s),o=async e=>{var t,a,o,s,u;try{switch(e.cmd){case n.ParentCommand.Completed:l(e.value);break;case n.ParentCommand.Failed:case n.ParentCommand.Error:{let t=Error();Object.assign(t,e.value),d(t);break}case n.ParentCommand.Progress:await r.updateProgress(e.value);break;case n.ParentCommand.Log:await r.log(e.value);break;case n.ParentCommand.MoveToDelayed:await r.moveToDelayed(null===(t=e.value)||void 0===t?void 0:t.timestamp,null===(a=e.value)||void 0===a?void 0:a.token);break;case n.ParentCommand.MoveToWait:await r.moveToWait(null===(o=e.value)||void 0===o?void 0:o.token);break;case n.ParentCommand.MoveToWaitingChildren:{let t=await r.moveToWaitingChildren(null===(s=e.value)||void 0===s?void 0:s.token,null===(u=e.value)||void 0===u?void 0:u.opts);i.send({requestId:e.requestId,cmd:n.ChildCommand.MoveToWaitingChildrenResponse,value:t})}break;case n.ParentCommand.Update:await r.updateData(e.value);break;case n.ParentCommand.GetChildrenValues:{let t=await r.getChildrenValues();i.send({requestId:e.requestId,cmd:n.ChildCommand.GetChildrenValuesResponse,value:t})}break;case n.ParentCommand.GetIgnoredChildrenFailures:{let t=await r.getIgnoredChildrenFailures();i.send({requestId:e.requestId,cmd:n.ChildCommand.GetIgnoredChildrenFailuresResponse,value:t})}}}catch(e){d(e)}},i.on("message",o),i.send({cmd:n.ChildCommand.Start,job:r.asJSONSandbox(),token:a})}catch(e){d(e)}};initChild()});return await l,l}finally{i&&(i.off("message",o),i.off("exit",s),null===i.exitCode&&null===i.signalCode&&t.release(i))}}},96727:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Scripts=void 0,t.raw2NextJobData=raw2NextJobData;let n=r(7224),a=new n.Packr({useRecords:!1,encodeUndefinedAsNil:!0}),i=a.pack,o=r(90875),s=r(2394),l=r(94068),d=r(12546);function raw2NextJobData(e){if(e){let t=[null,e[1],e[2],e[3]];return e[0]&&(t[0]=(0,s.array2obj)(e[0])),t}return[]}t.Scripts=class{constructor(e){this.queue=e,this.version=l.version;let t=this.queue.keys;this.moveToFinishedKeys=[t.wait,t.active,t.prioritized,t.events,t.stalled,t.limiter,t.delayed,t.paused,t.meta,t.pc,void 0,void 0,void 0,void 0]}execCommand(e,t,r){let n=`${t}:${this.version}`;return e[n](r)}async isJobInList(e,t){let r=await this.queue.client;return Number.isInteger((0,s.isRedisVersionLowerThan)(this.queue.redisVersion,"6.0.6")?await this.execCommand(r,"isJobInList",[e,t]):await r.lpos(e,t))}addDelayedJobArgs(e,t,r){let n=this.queue.keys,a=[n.marker,n.meta,n.id,n.delayed,n.completed,n.events];return a.push(i(r),e.data,t),a}addDelayedJob(e,t,r,n){let a=this.addDelayedJobArgs(t,r,n);return this.execCommand(e,"addDelayedJob",a)}addPrioritizedJobArgs(e,t,r){let n=this.queue.keys,a=[n.marker,n.meta,n.id,n.prioritized,n.delayed,n.completed,n.active,n.events,n.pc];return a.push(i(r),e.data,t),a}addPrioritizedJob(e,t,r,n){let a=this.addPrioritizedJobArgs(t,r,n);return this.execCommand(e,"addPrioritizedJob",a)}addParentJobArgs(e,t,r){let n=this.queue.keys,a=[n.meta,n.id,n.delayed,n["waiting-children"],n.completed,n.events];return a.push(i(r),e.data,t),a}addParentJob(e,t,r,n){let a=this.addParentJobArgs(t,r,n);return this.execCommand(e,"addParentJob",a)}addStandardJobArgs(e,t,r){let n=this.queue.keys,a=[n.wait,n.paused,n.meta,n.id,n.completed,n.delayed,n.active,n.events,n.marker];return a.push(i(r),e.data,t),a}addStandardJob(e,t,r,n){let a=this.addStandardJobArgs(t,r,n);return this.execCommand(e,"addStandardJob",a)}async addJob(e,t,r,n,a={}){let o,s;let l=this.queue.keys,d=t.parent,u=[l[""],void 0!==n?n:"",t.name,t.timestamp,t.parentKey||null,a.parentDependenciesKey||null,d,t.repeatJobKey,t.deduplicationId?`${l.de}:${t.deduplicationId}`:null];if(r.repeat){let e=Object.assign({},r.repeat);e.startDate&&(e.startDate=+new Date(e.startDate)),e.endDate&&(e.endDate=+new Date(e.endDate)),o=i(Object.assign(Object.assign({},r),{repeat:e}))}else o=i(r);if((s=a.addToWaitingChildren?await this.addParentJob(e,t,o,u):"number"==typeof r.delay&&r.delay>0?await this.addDelayedJob(e,t,o,u):r.priority?await this.addPrioritizedJob(e,t,o,u):await this.addStandardJob(e,t,o,u))<0)throw this.finishedErrors({code:s,parentKey:a.parentKey,command:"addJob"});return s}pauseArgs(e){let t="wait",r="paused";e||(t="paused",r="wait");let n=[t,r,"meta","prioritized"].map(e=>this.queue.toKey(e));return n.push(this.queue.keys.events,this.queue.keys.delayed,this.queue.keys.marker),n.concat([e?"paused":"resumed"])}async pause(e){let t=await this.queue.client,r=this.pauseArgs(e);return this.execCommand(t,"pause",r)}addRepeatableJobArgs(e,t,r,n){let a=this.queue.keys,o=[a.repeat,a.delayed],s=[t,i(r),n,e,a[""]];return o.concat(s)}async addRepeatableJob(e,t,r,n){let a=await this.queue.client,i=this.addRepeatableJobArgs(e,t,r,n);return this.execCommand(a,"addRepeatableJob",i)}async addJobScheduler(e,t,r,n,a,o,s){let l=await this.queue.client,d=this.queue.keys,u=[d.repeat,d.delayed,d.wait,d.paused,d.meta,d.prioritized,d.marker,d.id,d.events,d.pc,d.active],c=[t,i(a),e,r,i(n),i(o),Date.now(),d[""],s?this.queue.toKey(s):""],p=await this.execCommand(l,"addJobScheduler",u.concat(c));if("number"==typeof p&&p<0)throw this.finishedErrors({code:p,command:"addJobScheduler"});return p}async updateRepeatableJobMillis(e,t,r,n){let a=[this.queue.keys.repeat,r,t,n];return this.execCommand(e,"updateRepeatableJobMillis",a)}async updateJobSchedulerNextMillis(e,t,r,n,a){let o=await this.queue.client,s=this.queue.keys,l=[s.repeat,s.delayed,s.wait,s.paused,s.meta,s.prioritized,s.marker,s.id,s.events,s.pc,a?this.queue.toKey(a):"",s.active],d=[t,e,r,i(n),Date.now(),s[""],a];return this.execCommand(o,"updateJobScheduler",l.concat(d))}removeRepeatableArgs(e,t,r){let n=this.queue.keys,a=[n.repeat,n.delayed,n.events],i=[e,this.getRepeatConcatOptions(t,r),r,n[""]];return a.concat(i)}getRepeatConcatOptions(e,t){return t&&t.split(":").length>2?t:e}async removeRepeatable(e,t,r){let n=await this.queue.client,a=this.removeRepeatableArgs(e,t,r);return this.execCommand(n,"removeRepeatable",a)}async removeJobScheduler(e){let t=await this.queue.client,r=this.queue.keys,n=[r.repeat,r.delayed,r.events],a=[e,r[""]];return this.execCommand(t,"removeJobScheduler",n.concat(a))}removeArgs(e,t){let r=[e,"repeat"].map(e=>this.queue.toKey(e)),n=[e,t?1:0,this.queue.toKey("")];return r.concat(n)}async remove(e,t){let r=await this.queue.client,n=this.removeArgs(e,t),a=await this.execCommand(r,"removeJob",n);if(a<0)throw this.finishedErrors({code:a,jobId:e,command:"removeJob"});return a}async removeUnprocessedChildren(e){let t=await this.queue.client,r=[this.queue.toKey(e),this.queue.keys.meta,this.queue.toKey(""),e];await this.execCommand(t,"removeUnprocessedChildren",r)}async extendLock(e,t,r,n){n=n||await this.queue.client;let a=[this.queue.toKey(e)+":lock",this.queue.keys.stalled,t,r,e];return this.execCommand(n,"extendLock",a)}async extendLocks(e,t,r){let n=await this.queue.client,a=[this.queue.keys.stalled,this.queue.toKey(""),i(t),i(e),r];return this.execCommand(n,"extendLocks",a)}async updateData(e,t){let r=await this.queue.client,n=[this.queue.toKey(e.id)],a=JSON.stringify(t),i=await this.execCommand(r,"updateData",n.concat([a]));if(i<0)throw this.finishedErrors({code:i,jobId:e.id,command:"updateData"})}async updateProgress(e,t){let r=await this.queue.client,n=[this.queue.toKey(e),this.queue.keys.events,this.queue.keys.meta],a=JSON.stringify(t),i=await this.execCommand(r,"updateProgress",n.concat([e,a]));if(i<0)throw this.finishedErrors({code:i,jobId:e,command:"updateProgress"})}async addLog(e,t,r){let n=await this.queue.client,a=[this.queue.toKey(e),this.queue.toKey(e)+":logs"],i=await this.execCommand(n,"addLog",a.concat([e,t,r||""]));if(i<0)throw this.finishedErrors({code:i,jobId:e,command:"addLog"});return i}moveToFinishedArgs(e,t,r,n,a,o,l,d=!0,u){var c,p,y,m,h,f,b;let K=this.queue.keys,g=this.queue.opts,v="completed"===a?g.removeOnComplete:g.removeOnFail,I=this.queue.toKey(`metrics:${a}`),E=this.moveToFinishedKeys;E[10]=K[a],E[11]=this.queue.toKey(null!==(c=e.id)&&void 0!==c?c:""),E[12]=I,E[13]=this.queue.keys.marker;let S=this.getKeepJobs(n,v),j=[e.id,l,r,void 0===t?"null":t,a,!d||this.queue.closing?0:1,K[""],i({token:o,name:g.name,keepJobs:S,limiter:g.limiter,lockDuration:g.lockDuration,attempts:e.opts.attempts,maxMetricsSize:(null===(p=g.metrics)||void 0===p?void 0:p.maxDataPoints)?null===(y=g.metrics)||void 0===y?void 0:y.maxDataPoints:"",fpof:!!(null===(m=e.opts)||void 0===m?void 0:m.failParentOnFailure),cpof:!!(null===(h=e.opts)||void 0===h?void 0:h.continueParentOnFailure),idof:!!(null===(f=e.opts)||void 0===f?void 0:f.ignoreDependencyOnFailure),rdof:!!(null===(b=e.opts)||void 0===b?void 0:b.removeDependencyOnFailure)}),u?i((0,s.objectToFlatArray)(u)):void 0];return E.concat(j)}getKeepJobs(e,t){return void 0===e?t||{count:e?0:-1}:"object"==typeof e?e:"number"==typeof e?{count:e}:{count:e?0:-1}}async moveToFinished(e,t){let r=await this.queue.client,n=await this.execCommand(r,"moveToFinished",t);if(n<0)throw this.finishedErrors({code:n,jobId:e,command:"moveToFinished",state:"active"});if(void 0!==n)return raw2NextJobData(n)}drainArgs(e){let t=this.queue.keys,r=[t.wait,t.paused,t.delayed,t.prioritized,t.repeat],n=[t[""],e?"1":"0"];return r.concat(n)}async drain(e){let t=await this.queue.client,r=this.drainArgs(e);return this.execCommand(t,"drain",r)}removeChildDependencyArgs(e,t){let r=this.queue.keys,n=[r[""]],a=[this.queue.toKey(e),t];return n.concat(a)}async removeChildDependency(e,t){let r=await this.queue.client,n=this.removeChildDependencyArgs(e,t),a=await this.execCommand(r,"removeChildDependency",n);switch(a){case 0:return!0;case 1:return!1;default:throw this.finishedErrors({code:a,jobId:e,parentKey:t,command:"removeChildDependency"})}}getRangesArgs(e,t,r,n){let a=this.queue.keys,i=e.map(e=>"waiting"===e?"wait":e),o=[a[""]],s=[t,r,n?"1":"0",...i];return o.concat(s)}async getRanges(e,t=0,r=1,n=!1){let a=await this.queue.client,i=this.getRangesArgs(e,t,r,n);return await this.execCommand(a,"getRanges",i)}getCountsArgs(e){let t=this.queue.keys,r=e.map(e=>"waiting"===e?"wait":e),n=[t[""]],a=[...r];return n.concat(a)}async getCounts(e){let t=await this.queue.client,r=this.getCountsArgs(e);return await this.execCommand(t,"getCounts",r)}getCountsPerPriorityArgs(e){let t=[this.queue.keys.wait,this.queue.keys.paused,this.queue.keys.meta,this.queue.keys.prioritized];return t.concat(e)}async getCountsPerPriority(e){let t=await this.queue.client,r=this.getCountsPerPriorityArgs(e);return await this.execCommand(t,"getCountsPerPriority",r)}getDependencyCountsArgs(e,t){let r=[`${e}:processed`,`${e}:dependencies`,`${e}:failed`,`${e}:unsuccessful`].map(e=>this.queue.toKey(e));return r.concat(t)}async getDependencyCounts(e,t){let r=await this.queue.client,n=this.getDependencyCountsArgs(e,t);return await this.execCommand(r,"getDependencyCounts",n)}moveToCompletedArgs(e,t,r,n,a=!1){let i=Date.now();return this.moveToFinishedArgs(e,t,"returnvalue",r,"completed",n,i,a)}moveToFailedArgs(e,t,r,n,a=!1,i){let o=Date.now();return this.moveToFinishedArgs(e,t,"failedReason",r,"failed",n,o,a,i)}async isFinished(e,t=!1){let r=await this.queue.client,n=["completed","failed",e].map(e=>this.queue.toKey(e));return this.execCommand(r,"isFinished",n.concat([e,t?"1":""]))}async getState(e){let t=await this.queue.client,r=["completed","failed","delayed","active","wait","paused","waiting-children","prioritized"].map(e=>this.queue.toKey(e));return(0,s.isRedisVersionLowerThan)(this.queue.redisVersion,"6.0.6")?this.execCommand(t,"getState",r.concat([e])):this.execCommand(t,"getStateV2",r.concat([e]))}async changeDelay(e,t){let r=await this.queue.client,n=this.changeDelayArgs(e,t),a=await this.execCommand(r,"changeDelay",n);if(a<0)throw this.finishedErrors({code:a,jobId:e,command:"changeDelay",state:"delayed"})}changeDelayArgs(e,t){let r=Date.now(),n=[this.queue.keys.delayed,this.queue.keys.meta,this.queue.keys.marker,this.queue.keys.events];return n.concat([t,JSON.stringify(r),e,this.queue.toKey(e)])}async changePriority(e,t=0,r=!1){let n=await this.queue.client,a=this.changePriorityArgs(e,t,r),i=await this.execCommand(n,"changePriority",a);if(i<0)throw this.finishedErrors({code:i,jobId:e,command:"changePriority"})}changePriorityArgs(e,t=0,r=!1){let n=[this.queue.keys.wait,this.queue.keys.paused,this.queue.keys.meta,this.queue.keys.prioritized,this.queue.keys.active,this.queue.keys.pc,this.queue.keys.marker];return n.concat([t,this.queue.toKey(""),e,r?1:0])}moveToDelayedArgs(e,t,r,n,a={}){let o=this.queue.keys,l=[o.marker,o.active,o.prioritized,o.delayed,this.queue.toKey(e),o.events,o.meta,o.stalled];return l.concat([this.queue.keys[""],t,e,r,n,a.skipAttempt?"1":"0",a.fieldsToUpdate?i((0,s.objectToFlatArray)(a.fieldsToUpdate)):void 0])}moveToWaitingChildrenArgs(e,t,r){let n=Date.now(),a=(0,s.getParentKey)(r.child),i=["active","waiting-children",e,`${e}:dependencies`,`${e}:unsuccessful`,"stalled","events"].map(e=>this.queue.toKey(e));return i.concat([t,null!=a?a:"",JSON.stringify(n),e,this.queue.toKey("")])}isMaxedArgs(){let e=this.queue.keys,t=[e.meta,e.active];return t}async isMaxed(){let e=await this.queue.client,t=this.isMaxedArgs();return!!await this.execCommand(e,"isMaxed",t)}async moveToDelayed(e,t,r,n="0",a={}){let i=await this.queue.client,o=this.moveToDelayedArgs(e,t,n,r,a),s=await this.execCommand(i,"moveToDelayed",o);if(s<0)throw this.finishedErrors({code:s,jobId:e,command:"moveToDelayed",state:"active"})}async moveToWaitingChildren(e,t,r={}){let n=await this.queue.client,a=this.moveToWaitingChildrenArgs(e,t,r),i=await this.execCommand(n,"moveToWaitingChildren",a);switch(i){case 0:return!0;case 1:return!1;default:throw this.finishedErrors({code:i,jobId:e,command:"moveToWaitingChildren",state:"active"})}}getRateLimitTtlArgs(e){let t=[this.queue.keys.limiter,this.queue.keys.meta];return t.concat([null!=e?e:"0"])}async getRateLimitTtl(e){let t=await this.queue.client,r=this.getRateLimitTtlArgs(e);return this.execCommand(t,"getRateLimitTtl",r)}async cleanJobsInSet(e,t,r=0){let n=await this.queue.client;return this.execCommand(n,"cleanJobsInSet",[this.queue.toKey(e),this.queue.toKey("events"),this.queue.toKey("repeat"),this.queue.toKey(""),t,r,e])}getJobSchedulerArgs(e){let t=[this.queue.keys.repeat];return t.concat([e])}async getJobScheduler(e){let t=await this.queue.client,r=this.getJobSchedulerArgs(e);return this.execCommand(t,"getJobScheduler",r)}retryJobArgs(e,t,r,n={}){let a=[this.queue.keys.active,this.queue.keys.wait,this.queue.keys.paused,this.queue.toKey(e),this.queue.keys.meta,this.queue.keys.events,this.queue.keys.delayed,this.queue.keys.prioritized,this.queue.keys.pc,this.queue.keys.marker,this.queue.keys.stalled];return a.concat([this.queue.toKey(""),Date.now(),(t?"R":"L")+"PUSH",e,r,n.fieldsToUpdate?i((0,s.objectToFlatArray)(n.fieldsToUpdate)):void 0])}async retryJob(e,t,r="0",n={}){let a=await this.queue.client,i=this.retryJobArgs(e,t,r,n),o=await this.execCommand(a,"retryJob",i);if(o<0)throw this.finishedErrors({code:o,jobId:e,command:"retryJob",state:"active"})}moveJobsToWaitArgs(e,t,r){let n=[this.queue.toKey(""),this.queue.keys.events,this.queue.toKey(e),this.queue.toKey("wait"),this.queue.toKey("paused"),this.queue.keys.meta,this.queue.keys.active,this.queue.keys.marker],a=[t,r,e];return n.concat(a)}async retryJobs(e="failed",t=1e3,r=new Date().getTime()){let n=await this.queue.client,a=this.moveJobsToWaitArgs(e,t,r);return this.execCommand(n,"moveJobsToWait",a)}async promoteJobs(e=1e3){let t=await this.queue.client,r=this.moveJobsToWaitArgs("delayed",e,Number.MAX_VALUE);return this.execCommand(t,"moveJobsToWait",r)}async reprocessJob(e,t){let r=await this.queue.client,n=[this.queue.toKey(e.id),this.queue.keys.events,this.queue.toKey(t),this.queue.keys.wait,this.queue.keys.meta,this.queue.keys.paused,this.queue.keys.active,this.queue.keys.marker],a=[e.id,(e.opts.lifo?"R":"L")+"PUSH","failed"===t?"failedReason":"returnvalue",t],i=await this.execCommand(r,"reprocessJob",n.concat(a));if(1!==i)throw this.finishedErrors({code:i,jobId:e.id,command:"reprocessJob",state:t})}async getMetrics(e,t=0,r=-1){let n=await this.queue.client,a=[this.queue.toKey(`metrics:${e}`),this.queue.toKey(`metrics:${e}:data`)],i=await this.execCommand(n,"getMetrics",a.concat([t,r]));return i}async moveToActive(e,t,r){let n=this.queue.opts,a=this.queue.keys,o=[a.wait,a.active,a.prioritized,a.events,a.stalled,a.limiter,a.delayed,a.paused,a.meta,a.pc,a.marker],s=[a[""],Date.now(),i({token:t,lockDuration:n.lockDuration,limiter:n.limiter,name:r})],l=await this.execCommand(e,"moveToActive",o.concat(s));return raw2NextJobData(l)}async promote(e){let t=await this.queue.client,r=[this.queue.keys.delayed,this.queue.keys.wait,this.queue.keys.paused,this.queue.keys.meta,this.queue.keys.prioritized,this.queue.keys.active,this.queue.keys.pc,this.queue.keys.events,this.queue.keys.marker],n=[this.queue.toKey(""),e],a=await this.execCommand(t,"promote",r.concat(n));if(a<0)throw this.finishedErrors({code:a,jobId:e,command:"promote",state:"delayed"})}moveStalledJobsToWaitArgs(){let e=this.queue.opts,t=[this.queue.keys.stalled,this.queue.keys.wait,this.queue.keys.active,this.queue.keys["stalled-check"],this.queue.keys.meta,this.queue.keys.paused,this.queue.keys.marker,this.queue.keys.events],r=[e.maxStalledCount,this.queue.toKey(""),Date.now(),e.stalledInterval];return t.concat(r)}async moveStalledJobsToWait(){let e=await this.queue.client,t=this.moveStalledJobsToWaitArgs();return this.execCommand(e,"moveStalledJobsToWait",t)}async moveJobFromActiveToWait(e,t="0"){let r=await this.queue.client,n=[this.queue.keys.active,this.queue.keys.wait,this.queue.keys.stalled,this.queue.keys.paused,this.queue.keys.meta,this.queue.keys.limiter,this.queue.keys.prioritized,this.queue.keys.marker,this.queue.keys.events],a=[e,t,this.queue.toKey(e)],i=await this.execCommand(r,"moveJobFromActiveToWait",n.concat(a));if(i<0)throw this.finishedErrors({code:i,jobId:e,command:"moveJobFromActiveToWait",state:"active"});return i}async obliterate(e){let t=await this.queue.client,r=[this.queue.keys.meta,this.queue.toKey("")],n=[e.count,e.force?"force":null],a=await this.execCommand(t,"obliterate",r.concat(n));if(a<0)switch(a){case -1:throw Error("Cannot obliterate non-paused queue");case -2:throw Error("Cannot obliterate queue with active jobs")}return a}async paginate(e,t){let r=await this.queue.client,n=[e],a=t.end>=0?t.end-t.start+1:1/0,i="0",o=0,l,d,u,c=[],p=[];do{let e=[t.start+c.length,t.end,i,o,5];t.fetchJobs&&e.push(1),[i,o,l,d,u]=await this.execCommand(r,"paginate",n.concat(e)),c=c.concat(l),u&&u.length&&(p=p.concat(u.map(s.array2obj)))}while("0"!=i&&c.length<a);if(!(c.length&&Array.isArray(c[0])))return{cursor:i,items:c.map(e=>({id:e})),total:d,jobs:p};{let e=[];for(let t=0;t<c.length;t++){let[r,n]=c[t];try{e.push({id:r,v:JSON.parse(n)})}catch(t){e.push({id:r,err:t.message})}}return{cursor:i,items:e,total:d,jobs:p}}}finishedErrors({code:e,jobId:t,parentKey:r,command:n,state:a}){let i;switch(e){case o.ErrorCode.JobNotExist:i=Error(`Missing key for job ${t}. ${n}`);break;case o.ErrorCode.JobLockNotExist:i=Error(`Missing lock for job ${t}. ${n}`);break;case o.ErrorCode.JobNotInState:i=Error(`Job ${t} is not in the ${a} state. ${n}`);break;case o.ErrorCode.JobPendingChildren:i=Error(`Job ${t} has pending dependencies. ${n}`);break;case o.ErrorCode.ParentJobNotExist:i=Error(`Missing key for parent job ${r}. ${n}`);break;case o.ErrorCode.JobLockMismatch:i=Error(`Lock mismatch for job ${t}. Cmd ${n} from ${a}`);break;case o.ErrorCode.ParentJobCannotBeReplaced:i=Error(`The parent job ${r} cannot be replaced. ${n}`);break;case o.ErrorCode.JobBelongsToJobScheduler:i=Error(`Job ${t} belongs to a job scheduler and cannot be removed directly. ${n}`);break;case o.ErrorCode.JobHasFailedChildren:i=new d.UnrecoverableError(`Cannot complete job ${t} because it has at least one failed child. ${n}`);break;case o.ErrorCode.SchedulerJobIdCollision:i=Error(`Cannot create job scheduler iteration - job ID already exists. ${n}`);break;case o.ErrorCode.SchedulerJobSlotsBusy:i=Error(`Cannot create job scheduler iteration - current and next time slots already have jobs. ${n}`);break;default:i=Error(`Unknown code ${e} error for ${t}. ${n}`)}return i.code=e,i}}},10254:(e,t,r)=>{e=r.nmd(e),Object.defineProperty(t,"__esModule",{value:!0}),t.Worker=void 0;let n=r(57147),a=r(57310),i=r(71017),o=r(9925),s=r(36784),l=r(2394),d=r(94533),u=r(55587),c=r(19423),p=r(244),y=r(43754),m=r(47458),h=r(12546),f=r(90875),b=r(69550),K=r(33525);let Worker=class Worker extends d.QueueBase{static RateLimitError(){return new h.RateLimitError}constructor(t,r,s,d){if(super(t,Object.assign(Object.assign({drainDelay:5,concurrency:1,lockDuration:3e4,maxStalledCount:1,stalledInterval:3e4,autorun:!0,runRetryDelay:15e3},s),{blockingConnection:!0}),d),this.abortDelayController=null,this.blockUntil=0,this.drained=!1,this.limitUntil=0,this.waiting=null,this.running=!1,this.mainLoopRunning=null,!s||!s.connection)throw Error("Worker requires a connection");if("number"!=typeof this.opts.maxStalledCount||this.opts.maxStalledCount<0)throw Error("maxStalledCount must be greater or equal than 0");if("number"==typeof this.opts.maxStartedAttempts&&this.opts.maxStartedAttempts<0)throw Error("maxStartedAttempts must be greater or equal than 0");if("number"!=typeof this.opts.stalledInterval||this.opts.stalledInterval<=0)throw Error("stalledInterval must be greater than 0");if("number"!=typeof this.opts.drainDelay||this.opts.drainDelay<=0)throw Error("drainDelay must be greater than 0");if(this.concurrency=this.opts.concurrency,this.opts.lockRenewTime=this.opts.lockRenewTime||this.opts.lockDuration/2,this.id=(0,o.v4)(),this.lockManager=new K.LockManager(this,{lockRenewTime:this.opts.lockRenewTime,lockDuration:this.opts.lockDuration,workerId:this.id,workerName:this.opts.name}),r){if("function"==typeof r)this.processFn=r;else{if(r instanceof a.URL){if(!n.existsSync(r))throw Error(`URL ${r} does not exist in the local file system`);r=r.href}else{let e=r+([".js",".ts",".flow",".cjs",".mjs"].includes(i.extname(r))?"":".js");if(!n.existsSync(e))throw Error(`File ${e} does not exist`)}let t=i.dirname(e.filename||__filename),o=i.join(t,"main-worker.js"),s=i.join(t,"main.js"),l=this.opts.useWorkerThreads?o:s;try{n.statSync(l)}catch(t){let e=this.opts.useWorkerThreads?"main-worker.js":"main.js";l=i.join(process.cwd(),`dist/cjs/classes/${e}`),n.statSync(l)}this.childPool=new c.ChildPool({mainFile:l,useWorkerThreads:this.opts.useWorkerThreads,workerForkOptions:this.opts.workerForkOptions,workerThreadsOptions:this.opts.workerThreadsOptions}),this.processFn=(0,y.default)(r,this.childPool).bind(this)}this.opts.autorun&&this.run().catch(e=>this.emit("error",e))}let u=this.clientName()+(this.opts.name?`:w:${this.opts.name}`:"");this.blockingConnection=new p.RedisConnection((0,l.isRedisInstance)(s.connection)?s.connection.duplicate({connectionName:u}):Object.assign(Object.assign({},s.connection),{connectionName:u}),{shared:!1,blocking:!0,skipVersionCheck:s.skipVersionCheck}),this.blockingConnection.on("error",e=>this.emit("error",e)),this.blockingConnection.on("ready",()=>setTimeout(()=>this.emit("ready"),0))}async extendJobLocks(e,t,r){return this.scripts.extendLocks(e,t,r)}emit(e,...t){return super.emit(e,...t)}off(e,t){return super.off(e,t),this}on(e,t){return super.on(e,t),this}once(e,t){return super.once(e,t),this}callProcessJob(e,t){return this.processFn(e,t)}createJob(e,t){return this.Job.fromJSON(this,e,t)}async waitUntilReady(){return await super.waitUntilReady(),this.blockingConnection.client}set concurrency(e){if("number"!=typeof e||e<1||!isFinite(e))throw Error("concurrency must be a finite number greater than 0");this._concurrency=e}get concurrency(){return this._concurrency}get repeat(){return new Promise(async e=>{if(!this._repeat){let e=await this.client;this._repeat=new u.Repeat(this.name,Object.assign(Object.assign({},this.opts),{connection:e})),this._repeat.on("error",e=>this.emit.bind(this,e))}e(this._repeat)})}get jobScheduler(){return new Promise(async e=>{if(!this._jobScheduler){let e=await this.client;this._jobScheduler=new b.JobScheduler(this.name,Object.assign(Object.assign({},this.opts),{connection:e})),this._jobScheduler.on("error",e=>this.emit.bind(this,e))}e(this._jobScheduler)})}async run(){if(!this.processFn)throw Error("No process function is defined.");if(this.running)throw Error("Worker is already running.");try{if(this.running=!0,this.closing||this.paused)return;await this.startStalledCheckTimer(),this.opts.skipLockRenewal||this.lockManager.start();let e=await this.client,t=await this.blockingConnection.client;this.mainLoopRunning=this.mainLoop(e,t),await this.mainLoopRunning}finally{this.running=!1}}async waitForRateLimit(){var e;let t=this.limitUntil;if(t>Date.now()){null===(e=this.abortDelayController)||void 0===e||e.abort(),this.abortDelayController=new s.AbortController;let r=this.getRateLimitDelay(t-Date.now());await this.delay(r,this.abortDelayController)}}async mainLoop(e,t){let r=new m.AsyncFifoQueue,n=0;for(;!this.closing&&!this.paused||r.numTotal()>0;){let a;for(;!this.closing&&!this.paused&&!this.waiting&&r.numTotal()<this._concurrency&&!this.isRateLimited();){let a=`${this.id}:${n++}`,i=this.retryIfFailed(()=>this._getNextJob(e,t,a,{block:!0}),{delayInMs:this.opts.runRetryDelay,onlyEmitError:!0});if(r.add(i),this.waiting&&r.numTotal()>1)break;let o=await i;if(!o&&r.numTotal()>1||this.blockUntil)break}do a=await r.fetch();while(!a&&r.numQueued()>0);if(a){let e=a.token;r.add(this.processJob(a,e,()=>r.numTotal()<=this._concurrency))}else 0===r.numQueued()&&await this.waitForRateLimit()}}async getNextJob(e,{block:t=!0}={}){var r,n;let a=await this._getNextJob(await this.client,await this.blockingConnection.client,e,{block:t});return this.trace(f.SpanKind.INTERNAL,"getNextJob",this.name,async e=>(null==e||e.setAttributes({[f.TelemetryAttributes.WorkerId]:this.id,[f.TelemetryAttributes.QueueName]:this.name,[f.TelemetryAttributes.WorkerName]:this.opts.name,[f.TelemetryAttributes.WorkerOptions]:JSON.stringify({block:t}),[f.TelemetryAttributes.JobId]:null==a?void 0:a.id}),a),null===(n=null===(r=null==a?void 0:a.opts)||void 0===r?void 0:r.telemetry)||void 0===n?void 0:n.metadata)}async _getNextJob(e,t,r,{block:n=!0}={}){if(!this.paused&&!this.closing){if(this.drained&&n&&!this.limitUntil&&!this.waiting){this.waiting=this.waitForJob(t,this.blockUntil);try{if(this.blockUntil=await this.waiting,this.blockUntil<=0||this.blockUntil-Date.now()<1)return await this.moveToActive(e,r,this.opts.name)}finally{this.waiting=null}}else if(!this.isRateLimited())return this.moveToActive(e,r,this.opts.name)}}async rateLimit(e){await this.trace(f.SpanKind.INTERNAL,"rateLimit",this.name,async t=>{null==t||t.setAttributes({[f.TelemetryAttributes.WorkerId]:this.id,[f.TelemetryAttributes.WorkerRateLimit]:e}),await this.client.then(t=>t.set(this.keys.limiter,Number.MAX_SAFE_INTEGER,"PX",e))})}get minimumBlockTimeout(){return this.blockingConnection.capabilities.canBlockFor1Ms?.001:.002}isRateLimited(){return this.limitUntil>Date.now()}async moveToActive(e,t,r){let[n,a,i,o]=await this.scripts.moveToActive(e,t,r);return this.updateDelays(i,o),this.nextJobFromJobData(n,a,t)}async waitForJob(e,t){let r;if(this.paused)return 1/0;try{if(!this.closing&&!this.isRateLimited()){let n=this.getBlockTimeout(t);if(n>0){n=this.blockingConnection.capabilities.canDoubleTimeout?n:Math.ceil(n),r=setTimeout(async()=>{e.disconnect(!this.closing)},1e3*n+1e3),this.updateDelays();let a=await e.bzpopmin(this.keys.marker,n);if(a){let[e,r,n]=a;if(r){let e=parseInt(n);if(t&&e>t)return t;return e}}}return 0}}catch(e){(0,l.isNotConnectionError)(e)&&this.emit("error",e),this.closing||await this.delay()}finally{clearTimeout(r)}return 1/0}getBlockTimeout(e){let t=this.opts;if(!e)return Math.max(t.drainDelay,this.minimumBlockTimeout);{let t=e-Date.now();return t<=0?t:t<1e3*this.minimumBlockTimeout?this.minimumBlockTimeout:Math.min(t/1e3,10)}}getRateLimitDelay(e){return Math.min(e,3e4)}async delay(e,t){await (0,l.delay)(e||l.DELAY_TIME_1,t)}updateDelays(e=0,t=0){let r=Math.max(e,0);r>0?this.limitUntil=Date.now()+r:this.limitUntil=0,this.blockUntil=Math.max(t,0)||0}async nextJobFromJobData(e,t,r){if(e){this.drained=!1;let n=this.createJob(e,t);n.token=r;try{await this.retryIfFailed(async()=>{if(n.repeatJobKey&&n.repeatJobKey.split(":").length<5){let e=await this.jobScheduler;await e.upsertJobScheduler(n.repeatJobKey,n.opts.repeat,n.name,n.data,n.opts,{override:!1,producerId:n.id})}else if(n.opts.repeat){let e=await this.repeat;await e.updateRepeatableJob(n.name,n.data,n.opts,{override:!1})}},{delayInMs:this.opts.runRetryDelay})}catch(r){let e=r instanceof Error?r.message:String(r),t=Error(`Failed to add repeatable job for next iteration: ${e}`);this.emit("error",t);return}return n}this.drained||(this.emit("drained"),this.drained=!0)}async processJob(e,t,r=()=>!0){var n,a;let i=null===(a=null===(n=e.opts)||void 0===n?void 0:n.telemetry)||void 0===a?void 0:a.metadata;return this.trace(f.SpanKind.CONSUMER,"process",this.name,async n=>{null==n||n.setAttributes({[f.TelemetryAttributes.WorkerId]:this.id,[f.TelemetryAttributes.WorkerName]:this.opts.name,[f.TelemetryAttributes.JobId]:e.id,[f.TelemetryAttributes.JobName]:e.name,[f.TelemetryAttributes.JobAttemptsMade]:e.attemptsMade}),this.emit("active",e,"waiting");let a=Date.now();this.lockManager.trackJob(e.id,t,a);try{let a=this.getUnrecoverableErrorMessage(e);if(a){let i=await this.retryIfFailed(()=>this.handleFailed(new h.UnrecoverableError(a),e,t,r,n),{delayInMs:this.opts.runRetryDelay,span:n});return i}let i=await this.callProcessJob(e,t);return await this.retryIfFailed(()=>this.handleCompleted(i,e,t,r,n),{delayInMs:this.opts.runRetryDelay,span:n})}catch(i){let a=await this.retryIfFailed(()=>this.handleFailed(i,e,t,r,n),{delayInMs:this.opts.runRetryDelay,span:n,onlyEmitError:!0});return a}finally{this.lockManager.untrackJob(e.id),null==n||n.setAttributes({[f.TelemetryAttributes.JobFinishedTimestamp]:Date.now(),[f.TelemetryAttributes.JobProcessedTimestamp]:a})}},i)}getUnrecoverableErrorMessage(e){return e.deferredFailure?e.deferredFailure:this.opts.maxStartedAttempts&&this.opts.maxStartedAttempts<e.attemptsStarted?"job started more than allowable limit":void 0}async handleCompleted(e,t,r,n=()=>!0,a){if(!this.connection.closing){let i=await t.moveToCompleted(e,r,n()&&!(this.closing||this.paused));this.emit("completed",t,e,"active"),null==a||a.addEvent("job completed",{[f.TelemetryAttributes.JobResult]:JSON.stringify(e)});let[o,s,l,d]=i||[];return this.updateDelays(l,d),this.nextJobFromJobData(o,s,r)}}async handleFailed(e,t,r,n=()=>!0,a){if(!this.connection.closing){if(e.message===h.RATE_LIMIT_ERROR){let e=await this.moveLimitedBackToWait(t,r);this.limitUntil=e>0?Date.now()+e:0;return}if(e instanceof h.DelayedError||"DelayedError"==e.name||e instanceof h.WaitingError||"WaitingError"==e.name||e instanceof h.WaitingChildrenError||"WaitingChildrenError"==e.name){let e=await this.client;return this.moveToActive(e,r,this.opts.name)}let i=await t.moveToFailed(e,r,n()&&!(this.closing||this.paused));if(this.emit("failed",t,e,"active"),null==a||a.addEvent("job failed",{[f.TelemetryAttributes.JobFailedReason]:e.message}),i){let[e,t,n,a]=i;return this.updateDelays(n,a),this.nextJobFromJobData(e,t,r)}}}async pause(e){await this.trace(f.SpanKind.INTERNAL,"pause",this.name,async t=>{var r;null==t||t.setAttributes({[f.TelemetryAttributes.WorkerId]:this.id,[f.TelemetryAttributes.WorkerName]:this.opts.name,[f.TelemetryAttributes.WorkerDoNotWaitActive]:e}),this.paused||(this.paused=!0,e||await this.whenCurrentJobsFinished(),null===(r=this.stalledCheckStopper)||void 0===r||r.call(this),this.emit("paused"))})}resume(){this.running||this.trace(f.SpanKind.INTERNAL,"resume",this.name,e=>{null==e||e.setAttributes({[f.TelemetryAttributes.WorkerId]:this.id,[f.TelemetryAttributes.WorkerName]:this.opts.name}),this.paused=!1,this.processFn&&this.run(),this.emit("resumed")})}isPaused(){return!!this.paused}isRunning(){return this.running}async close(e=!1){return this.closing?this.closing:(this.closing=(async()=>{await this.trace(f.SpanKind.INTERNAL,"close",this.name,async t=>{var r,n;null==t||t.setAttributes({[f.TelemetryAttributes.WorkerId]:this.id,[f.TelemetryAttributes.WorkerName]:this.opts.name,[f.TelemetryAttributes.WorkerForceClose]:e}),this.emit("closing","closing queue"),null===(r=this.abortDelayController)||void 0===r||r.abort();let a=[()=>e||this.whenCurrentJobsFinished(!1),()=>this.lockManager.close(),()=>{var e;return null===(e=this.childPool)||void 0===e?void 0:e.clean()},()=>this.blockingConnection.close(e),()=>this.connection.close(e)];for(let e of a)try{await e()}catch(e){this.emit("error",e)}null===(n=this.stalledCheckStopper)||void 0===n||n.call(this),this.closed=!0,this.emit("closed")})})(),await this.closing)}async startStalledCheckTimer(){this.opts.skipStalledCheck||this.closing||await this.trace(f.SpanKind.INTERNAL,"startStalledCheckTimer",this.name,async e=>{null==e||e.setAttributes({[f.TelemetryAttributes.WorkerId]:this.id,[f.TelemetryAttributes.WorkerName]:this.opts.name}),this.stalledChecker().catch(e=>{this.emit("error",e)})})}async stalledChecker(){for(;!(this.closing||this.paused);)await this.checkConnectionError(()=>this.moveStalledJobsToWait()),await new Promise(e=>{let t=setTimeout(e,this.opts.stalledInterval);this.stalledCheckStopper=()=>{clearTimeout(t),e()}})}async whenCurrentJobsFinished(e=!0){this.waiting?await this.blockingConnection.disconnect(e):e=!1,this.mainLoopRunning&&await this.mainLoopRunning,e&&await this.blockingConnection.reconnect()}async retryIfFailed(e,t){var r;let n=0,a=t.maxRetries||1/0;do try{return await e()}catch(e){if(null===(r=t.span)||void 0===r||r.recordException(e.message),(0,l.isNotConnectionError)(e)){if(this.paused||this.closing||this.emit("error",e),t.onlyEmitError)return;throw e}if(!t.delayInMs||this.closing||this.closed||await this.delay(t.delayInMs,this.abortDelayController),n+1>=a)throw e}while(++n<a)}async moveStalledJobsToWait(){await this.trace(f.SpanKind.INTERNAL,"moveStalledJobsToWait",this.name,async e=>{let t=await this.scripts.moveStalledJobsToWait();null==e||e.setAttributes({[f.TelemetryAttributes.WorkerId]:this.id,[f.TelemetryAttributes.WorkerName]:this.opts.name,[f.TelemetryAttributes.WorkerStalledJobs]:t}),t.forEach(t=>{null==e||e.addEvent("job stalled",{[f.TelemetryAttributes.JobId]:t}),this.emit("stalled",t,"active")})})}moveLimitedBackToWait(e,t){return e.moveToWait(t)}};t.Worker=Worker},31008:(e,t)=>{var r;Object.defineProperty(t,"__esModule",{value:!0}),t.ChildCommand=void 0,function(e){e[e.Init=0]="Init",e[e.Start=1]="Start",e[e.Stop=2]="Stop",e[e.GetChildrenValuesResponse=3]="GetChildrenValuesResponse",e[e.GetIgnoredChildrenFailuresResponse=4]="GetIgnoredChildrenFailuresResponse",e[e.MoveToWaitingChildrenResponse=5]="MoveToWaitingChildrenResponse"}(r||(t.ChildCommand=r={}))},69796:(e,t)=>{var r;Object.defineProperty(t,"__esModule",{value:!0}),t.ErrorCode=void 0,function(e){e[e.JobNotExist=-1]="JobNotExist",e[e.JobLockNotExist=-2]="JobLockNotExist",e[e.JobNotInState=-3]="JobNotInState",e[e.JobPendingChildren=-4]="JobPendingChildren",e[e.ParentJobNotExist=-5]="ParentJobNotExist",e[e.JobLockMismatch=-6]="JobLockMismatch",e[e.ParentJobCannotBeReplaced=-7]="ParentJobCannotBeReplaced",e[e.JobBelongsToJobScheduler=-8]="JobBelongsToJobScheduler",e[e.JobHasFailedChildren=-9]="JobHasFailedChildren",e[e.SchedulerJobIdCollision=-10]="SchedulerJobIdCollision",e[e.SchedulerJobSlotsBusy=-11]="SchedulerJobSlotsBusy"}(r||(t.ErrorCode=r={}))},90875:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(87175);n.__exportStar(r(31008),t),n.__exportStar(r(69796),t),n.__exportStar(r(87565),t),n.__exportStar(r(16396),t),n.__exportStar(r(71145),t)},16396:(e,t)=>{var r;Object.defineProperty(t,"__esModule",{value:!0}),t.MetricsTime=void 0,function(e){e[e.ONE_MINUTE=1]="ONE_MINUTE",e[e.FIVE_MINUTES=5]="FIVE_MINUTES",e[e.FIFTEEN_MINUTES=15]="FIFTEEN_MINUTES",e[e.THIRTY_MINUTES=30]="THIRTY_MINUTES",e[e.ONE_HOUR=60]="ONE_HOUR",e[e.ONE_WEEK=10080]="ONE_WEEK",e[e.TWO_WEEKS=20160]="TWO_WEEKS",e[e.ONE_MONTH=80640]="ONE_MONTH"}(r||(t.MetricsTime=r={}))},87565:(e,t)=>{var r;Object.defineProperty(t,"__esModule",{value:!0}),t.ParentCommand=void 0,function(e){e[e.Completed=0]="Completed",e[e.Error=1]="Error",e[e.Failed=2]="Failed",e[e.InitFailed=3]="InitFailed",e[e.InitCompleted=4]="InitCompleted",e[e.Log=5]="Log",e[e.MoveToDelayed=6]="MoveToDelayed",e[e.MoveToWait=7]="MoveToWait",e[e.Progress=8]="Progress",e[e.Update=9]="Update",e[e.GetChildrenValues=10]="GetChildrenValues",e[e.GetIgnoredChildrenFailures=11]="GetIgnoredChildrenFailures",e[e.MoveToWaitingChildren=12]="MoveToWaitingChildren"}(r||(t.ParentCommand=r={}))},71145:(e,t)=>{var r,n;Object.defineProperty(t,"__esModule",{value:!0}),t.SpanKind=t.TelemetryAttributes=void 0,function(e){e.QueueName="bullmq.queue.name",e.QueueOperation="bullmq.queue.operation",e.BulkCount="bullmq.job.bulk.count",e.BulkNames="bullmq.job.bulk.names",e.JobName="bullmq.job.name",e.JobId="bullmq.job.id",e.JobKey="bullmq.job.key",e.JobIds="bullmq.job.ids",e.JobAttemptsMade="bullmq.job.attempts.made",e.DeduplicationKey="bullmq.job.deduplication.key",e.JobOptions="bullmq.job.options",e.JobProgress="bullmq.job.progress",e.QueueDrainDelay="bullmq.queue.drain.delay",e.QueueGrace="bullmq.queue.grace",e.QueueCleanLimit="bullmq.queue.clean.limit",e.QueueRateLimit="bullmq.queue.rate.limit",e.JobType="bullmq.job.type",e.QueueOptions="bullmq.queue.options",e.QueueEventMaxLength="bullmq.queue.event.max.length",e.WorkerOptions="bullmq.worker.options",e.WorkerName="bullmq.worker.name",e.WorkerId="bullmq.worker.id",e.WorkerRateLimit="bullmq.worker.rate.limit",e.WorkerDoNotWaitActive="bullmq.worker.do.not.wait.active",e.WorkerForceClose="bullmq.worker.force.close",e.WorkerStalledJobs="bullmq.worker.stalled.jobs",e.WorkerFailedJobs="bullmq.worker.failed.jobs",e.WorkerJobsToExtendLocks="bullmq.worker.jobs.to.extend.locks",e.JobFinishedTimestamp="bullmq.job.finished.timestamp",e.JobProcessedTimestamp="bullmq.job.processed.timestamp",e.JobResult="bullmq.job.result",e.JobFailedReason="bullmq.job.failed.reason",e.FlowName="bullmq.flow.name",e.JobSchedulerId="bullmq.job.scheduler.id"}(r||(t.TelemetryAttributes=r={})),function(e){e[e.INTERNAL=0]="INTERNAL",e[e.SERVER=1]="SERVER",e[e.CLIENT=2]="CLIENT",e[e.PRODUCER=3]="PRODUCER",e[e.CONSUMER=4]="CONSUMER"}(n||(t.SpanKind=n={}))},79701:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(87175);n.__exportStar(r(61171),t),n.__exportStar(r(90875),t),n.__exportStar(r(48706),t),n.__exportStar(r(46133),t),n.__exportStar(r(2394),t),n.__exportStar(r(16079),t),n.__exportStar(r(57669),t)},7843:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},88773:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},88527:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},3321:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},61750:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},25847:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},48706:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(87175);n.__exportStar(r(7843),t),n.__exportStar(r(88773),t),n.__exportStar(r(88527),t),n.__exportStar(r(3321),t),n.__exportStar(r(61750),t),n.__exportStar(r(25847),t),n.__exportStar(r(20624),t),n.__exportStar(r(25854),t),n.__exportStar(r(76793),t),n.__exportStar(r(95298),t),n.__exportStar(r(33608),t),n.__exportStar(r(8485),t),n.__exportStar(r(82187),t),n.__exportStar(r(55955),t),n.__exportStar(r(63926),t),n.__exportStar(r(55052),t),n.__exportStar(r(59465),t),n.__exportStar(r(29454),t),n.__exportStar(r(69014),t),n.__exportStar(r(93909),t),n.__exportStar(r(60717),t),n.__exportStar(r(89517),t),n.__exportStar(r(30355),t),n.__exportStar(r(65291),t),n.__exportStar(r(1304),t),n.__exportStar(r(9944),t),n.__exportStar(r(22034),t),n.__exportStar(r(41041),t),n.__exportStar(r(79871),t),n.__exportStar(r(60581),t),n.__exportStar(r(55564),t),n.__exportStar(r(66287),t)},20624:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},25854:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},76793:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},95298:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},33608:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},8485:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},82187:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},55955:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},63926:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},59465:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},55052:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},29454:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},69014:(e,t)=>{var r;Object.defineProperty(t,"__esModule",{value:!0}),t.ClientType=void 0,function(e){e.blocking="blocking",e.normal="normal"}(r||(t.ClientType=r={}))},93909:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},66287:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},60717:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},89517:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},1304:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},30355:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},65291:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},22034:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},41041:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},79871:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},9944:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},55564:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},60581:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},3805:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addDelayedJob=void 0;let r=`--[[
  Adds a delayed job to the queue by doing the following:
    - Increases the job counter if needed.
    - Creates a new job key with the job data.
    - computes timestamp.
    - adds to delayed zset.
    - Emits a global event 'delayed' if the job is delayed.
    Input:
      KEYS[1] 'marker',
      KEYS[2] 'meta'
      KEYS[3] 'id'
      KEYS[4] 'delayed'
      KEYS[5] 'completed'
      KEYS[6] events stream key
      ARGV[1] msgpacked arguments array
            [1]  key prefix,
            [2]  custom id (use custom instead of one generated automatically)
            [3]  name
            [4]  timestamp
            [5]  parentKey?
            [6]  parent dependencies key.
            [7]  parent? {id, queueKey}
            [8]  repeat job key
            [9] deduplication key
      ARGV[2] Json stringified job data
      ARGV[3] msgpacked options
      Output:
        jobId  - OK
        -5     - Missing parent key
]]
local metaKey = KEYS[2]
local idKey = KEYS[3]
local delayedKey = KEYS[4]
local completedKey = KEYS[5]
local eventsKey = KEYS[6]
local jobId
local jobIdKey
local rcall = redis.call
local args = cmsgpack.unpack(ARGV[1])
local data = ARGV[2]
local parentKey = args[5]
local parent = args[7]
local repeatJobKey = args[8]
local deduplicationKey = args[9]
local parentData
-- Includes
--[[
  Adds a delayed job to the queue by doing the following:
    - Creates a new job key with the job data.
    - adds to delayed zset.
    - Emits a global event 'delayed' if the job is delayed.
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Bake in the job id first 12 bits into the timestamp
  to guarantee correct execution order of delayed jobs
  (up to 4096 jobs per given timestamp or 4096 jobs apart per timestamp)
  WARNING: Jobs that are so far apart that they wrap around will cause FIFO to fail
]]
local function getDelayedScore(delayedKey, timestamp, delay)
  local delayedTimestamp = (delay > 0 and (tonumber(timestamp) + delay)) or tonumber(timestamp)
  local minScore = delayedTimestamp * 0x1000
  local maxScore = (delayedTimestamp + 1 ) * 0x1000 - 1
  local result = rcall("ZREVRANGEBYSCORE", delayedKey, maxScore,
    minScore, "WITHSCORES","LIMIT", 0, 1)
  if #result then
    local currentMaxScore = tonumber(result[2])
    if currentMaxScore ~= nil then
      if currentMaxScore >= maxScore then
        return maxScore, delayedTimestamp
      else
        return currentMaxScore + 1, delayedTimestamp
      end
    end
  end
  return minScore, delayedTimestamp
end
local function addDelayedJob(jobId, delayedKey, eventsKey, timestamp,
  maxEvents, markerKey, delay)
  local score, delayedTimestamp = getDelayedScore(delayedKey, timestamp, tonumber(delay))
  rcall("ZADD", delayedKey, score, jobId)
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "delayed",
    "jobId", jobId, "delay", delayedTimestamp)
  -- mark that a delayed job is available
  addDelayMarkerIfNeeded(markerKey, delayedKey)
end
--[[
  Function to debounce a job.
]]
-- Includes
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
local function removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents, currentDeduplicatedJobId,
    jobId, deduplicationId, prefix)
    if rcall("ZREM", delayedKey, currentDeduplicatedJobId) > 0 then
        removeJobKeys(prefix .. currentDeduplicatedJobId)
        rcall("XADD", eventsKey, "*", "event", "removed", "jobId", currentDeduplicatedJobId,
            "prev", "delayed")
        -- TODO remove debounced event in next breaking change
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
            jobId, "debounceId", deduplicationId)
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
            jobId, "deduplicationId", deduplicationId, "deduplicatedJobId", currentDeduplicatedJobId)
        return true
    end
    return false
end
local function deduplicateJob(deduplicationOpts, jobId, delayedKey, deduplicationKey, eventsKey, maxEvents,
    prefix)
    local deduplicationId = deduplicationOpts and deduplicationOpts['id']
    if deduplicationId then
        local ttl = deduplicationOpts['ttl']
        if deduplicationOpts['replace'] then
            if ttl and ttl > 0 then
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                if currentDebounceJobId then
                    local isRemoved = removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents,
                        currentDebounceJobId, jobId, deduplicationId, prefix)
                    if isRemoved then
                        if deduplicationOpts['extend'] then
                            rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                        else
                            rcall('SET', deduplicationKey, jobId, 'KEEPTTL')
                        end
                        return
                    else
                        return currentDebounceJobId
                    end
                else
                    rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                    return
                end
            else
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                if currentDebounceJobId then
                    local isRemoved = removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents,
                        currentDebounceJobId, jobId, deduplicationId, prefix)
                    if isRemoved then
                        rcall('SET', deduplicationKey, jobId)
                        return
                    else
                        return currentDebounceJobId
                    end
                else
                    rcall('SET', deduplicationKey, jobId)
                    return
                end
            end
        else
            local deduplicationKeyExists
            if ttl and ttl > 0 then
                if deduplicationOpts['extend'] then
                    local currentDebounceJobId = rcall('GET', deduplicationKey)
                    if currentDebounceJobId then
                        rcall('SET', deduplicationKey, currentDebounceJobId, 'PX', ttl)
                        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced",
                            "jobId", currentDebounceJobId, "debounceId", deduplicationId)
                        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                            currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                        return currentDebounceJobId
                    else
                        rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                        return
                    end
                else
                    deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'PX', ttl, 'NX')
                end
            else
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
            end
            if deduplicationKeyExists then
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                -- TODO remove debounced event in next breaking change
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
                    currentDebounceJobId, "debounceId", deduplicationId)
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                    currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                return currentDebounceJobId
            end
        end
    end
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to handle the case when job is duplicated.
]]
-- Includes
--[[
    This function is used to update the parent's dependencies if the job
    is already completed and about to be ignored. The parent must get its
    dependencies updated to avoid the parent job being stuck forever in 
    the waiting-children state.
]]
-- Includes
--[[
  Validate and move or add dependencies to parent.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized)
  if no pending dependencies.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized) if needed.
]]
-- Includes
--[[
  Move parent to a wait status (wait, prioritized or delayed)
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    local parentWaitKey = parentQueueKey .. ":wait"
    local parentPausedKey = parentQueueKey .. ":paused"
    local parentActiveKey = parentQueueKey .. ":active"
    local parentMetaKey = parentQueueKey .. ":meta"
    local parentMarkerKey = parentQueueKey .. ":marker"
    local jobAttributes = rcall("HMGET", parentKey, "priority", "delay")
    local priority = tonumber(jobAttributes[1]) or 0
    local delay = tonumber(jobAttributes[2]) or 0
    if delay > 0 then
        local delayedTimestamp = tonumber(timestamp) + delay
        local score = delayedTimestamp * 0x1000
        local parentDelayedKey = parentQueueKey .. ":delayed"
        rcall("ZADD", parentDelayedKey, score, parentId)
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "delayed", "jobId", parentId, "delay",
            delayedTimestamp)
        addDelayMarkerIfNeeded(parentMarkerKey, parentDelayedKey)
    else
        if priority == 0 then
            local parentTarget, isParentPausedOrMaxed = getTargetQueueList(parentMetaKey, parentActiveKey,
                parentWaitKey, parentPausedKey)
            addJobInTargetList(parentTarget, parentMarkerKey, "RPUSH", isParentPausedOrMaxed, parentId)
        else
            local isPausedOrMaxed = isQueuePausedOrMaxed(parentMetaKey, parentActiveKey)
            addJobWithPriority(parentMarkerKey, parentQueueKey .. ":prioritized", priority, parentId,
                parentQueueKey .. ":pc", isPausedOrMaxed)
        end
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "waiting", "jobId", parentId, "prev",
            "waiting-children")
    end
end
local function moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then    
      rcall("ZREM", parentWaitingChildrenKey, parentId)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    end
  end
end
local function moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey,
  parentId, timestamp)
  local doNotHavePendingDependencies = rcall("SCARD", parentDependenciesKey) == 0
  if doNotHavePendingDependencies then
    moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  end
end
local function updateParentDepsIfNeeded(parentKey, parentQueueKey, parentDependenciesKey,
  parentId, jobIdKey, returnvalue, timestamp )
  local processedSet = parentKey .. ":processed"
  rcall("HSET", processedSet, jobIdKey, returnvalue)
  moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey, parentId, timestamp)
end
local function updateExistingJobsParent(parentKey, parent, parentData,
                                        parentDependenciesKey, completedKey,
                                        jobIdKey, jobId, timestamp)
    if parentKey ~= nil then
        if rcall("ZSCORE", completedKey, jobId) then
            local returnvalue = rcall("HGET", jobIdKey, "returnvalue")
            updateParentDepsIfNeeded(parentKey, parent['queueKey'],
                                     parentDependenciesKey, parent['id'],
                                     jobIdKey, returnvalue, timestamp)
        else
            if parentDependenciesKey ~= nil then
                rcall("SADD", parentDependenciesKey, jobIdKey)
            end
        end
        rcall("HMSET", jobIdKey, "parentKey", parentKey, "parent", parentData)
    end
end
local function handleDuplicatedJob(jobKey, jobId, currentParentKey, currentParent,
  parentData, parentDependenciesKey, completedKey, eventsKey, maxEvents, timestamp)
  local existedParentKey = rcall("HGET", jobKey, "parentKey")
  if not existedParentKey or existedParentKey == currentParentKey then
    updateExistingJobsParent(currentParentKey, currentParent, parentData,
      parentDependenciesKey, completedKey, jobKey,
      jobId, timestamp)
  else
    if currentParentKey ~= nil and currentParentKey ~= existedParentKey
      and (rcall("EXISTS", existedParentKey) == 1) then
      return -7
    end
  end
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event",
    "duplicated", "jobId", jobId)
  return jobId .. "" -- convert to string
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
if parentKey ~= nil then
    if rcall("EXISTS", parentKey) ~= 1 then return -5 end
    parentData = cjson.encode(parent)
end
local jobCounter = rcall("INCR", idKey)
local maxEvents = getOrSetMaxEvents(metaKey)
local opts = cmsgpack.unpack(ARGV[3])
local parentDependenciesKey = args[6]
local timestamp = args[4]
if args[2] == "" then
    jobId = jobCounter
    jobIdKey = args[1] .. jobId
else
    jobId = args[2]
    jobIdKey = args[1] .. jobId
    if rcall("EXISTS", jobIdKey) == 1 then
        return handleDuplicatedJob(jobIdKey, jobId, parentKey, parent,
            parentData, parentDependenciesKey, completedKey, eventsKey,
            maxEvents, timestamp)
    end
end
local deduplicationJobId = deduplicateJob(opts['de'], jobId, delayedKey, deduplicationKey,
  eventsKey, maxEvents, args[1])
if deduplicationJobId then
  return deduplicationJobId
end
local delay, priority = storeJob(eventsKey, jobIdKey, jobId, args[3], ARGV[2],
    opts, timestamp, parentKey, parentData, repeatJobKey)
addDelayedJob(jobId, delayedKey, eventsKey, timestamp, maxEvents, KEYS[1], delay)
-- Check if this job is a child of another job, if so add it to the parents dependencies
if parentDependenciesKey ~= nil then
    rcall("SADD", parentDependenciesKey, jobIdKey)
end
return jobId .. "" -- convert to string
`;t.addDelayedJob={name:"addDelayedJob",content:r,keys:6}},81819:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addJobScheduler=void 0;let r=`--[[
  Adds a job scheduler, i.e. a job factory that creates jobs based on a given schedule (repeat options).
    Input:
      KEYS[1]  'repeat' key
      KEYS[2]  'delayed' key
      KEYS[3]  'wait' key
      KEYS[4]  'paused' key
      KEYS[5]  'meta' key
      KEYS[6]  'prioritized' key
      KEYS[7]  'marker' key
      KEYS[8]  'id' key
      KEYS[9]  'events' key
      KEYS[10] 'pc' priority counter
      KEYS[11] 'active' key
      ARGV[1] next milliseconds
      ARGV[2] msgpacked options
            [1]  name
            [2]  tz?
            [3]  pattern?
            [4]  endDate?
            [5]  every?
      ARGV[3] jobs scheduler id
      ARGV[4] Json stringified template data
      ARGV[5] mspacked template opts
      ARGV[6] msgpacked delayed opts
      ARGV[7] timestamp
      ARGV[8] prefix key
      ARGV[9] producer key
      Output:
        repeatableKey  - OK
]] local rcall = redis.call
local repeatKey = KEYS[1]
local delayedKey = KEYS[2]
local waitKey = KEYS[3]
local pausedKey = KEYS[4]
local metaKey = KEYS[5]
local prioritizedKey = KEYS[6]
local eventsKey = KEYS[9]
local nextMillis = ARGV[1]
local jobSchedulerId = ARGV[3]
local templateOpts = cmsgpack.unpack(ARGV[5])
local now = tonumber(ARGV[7])
local prefixKey = ARGV[8]
local jobOpts = cmsgpack.unpack(ARGV[6])
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Adds a delayed job to the queue by doing the following:
    - Creates a new job key with the job data.
    - adds to delayed zset.
    - Emits a global event 'delayed' if the job is delayed.
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Bake in the job id first 12 bits into the timestamp
  to guarantee correct execution order of delayed jobs
  (up to 4096 jobs per given timestamp or 4096 jobs apart per timestamp)
  WARNING: Jobs that are so far apart that they wrap around will cause FIFO to fail
]]
local function getDelayedScore(delayedKey, timestamp, delay)
  local delayedTimestamp = (delay > 0 and (tonumber(timestamp) + delay)) or tonumber(timestamp)
  local minScore = delayedTimestamp * 0x1000
  local maxScore = (delayedTimestamp + 1 ) * 0x1000 - 1
  local result = rcall("ZREVRANGEBYSCORE", delayedKey, maxScore,
    minScore, "WITHSCORES","LIMIT", 0, 1)
  if #result then
    local currentMaxScore = tonumber(result[2])
    if currentMaxScore ~= nil then
      if currentMaxScore >= maxScore then
        return maxScore, delayedTimestamp
      else
        return currentMaxScore + 1, delayedTimestamp
      end
    end
  end
  return minScore, delayedTimestamp
end
local function addDelayedJob(jobId, delayedKey, eventsKey, timestamp,
  maxEvents, markerKey, delay)
  local score, delayedTimestamp = getDelayedScore(delayedKey, timestamp, tonumber(delay))
  rcall("ZADD", delayedKey, score, jobId)
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "delayed",
    "jobId", jobId, "delay", delayedTimestamp)
  -- mark that a delayed job is available
  addDelayMarkerIfNeeded(markerKey, delayedKey)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePaused(queueMetaKey)
  return rcall("HEXISTS", queueMetaKey, "paused") == 1
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
local function addJobFromScheduler(jobKey, jobId, opts, waitKey, pausedKey, activeKey, metaKey, 
  prioritizedKey, priorityCounter, delayedKey, markerKey, eventsKey, name, maxEvents, timestamp,
  data, jobSchedulerId, repeatDelay)
  opts['delay'] = repeatDelay
  opts['jobId'] = jobId
  local delay, priority = storeJob(eventsKey, jobKey, jobId, name, data,
    opts, timestamp, nil, nil, jobSchedulerId)
  if delay ~= 0 then
    addDelayedJob(jobId, delayedKey, eventsKey, timestamp, maxEvents, markerKey, delay)
  else
    local target, isPausedOrMaxed = getTargetQueueList(metaKey, activeKey, waitKey, pausedKey)
    -- Standard or priority add
    if priority == 0 then
      local pushCmd = opts['lifo'] and 'RPUSH' or 'LPUSH'
      addJobInTargetList(target, markerKey, pushCmd, isPausedOrMaxed, jobId)
    else
      -- Priority add
      addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounter, isPausedOrMaxed)
    end
    -- Emit waiting event
    rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents,  "*", "event", "waiting", "jobId", jobId)
  end
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobKey, jobId)
  local deduplicationId = rcall("HGET", jobKey, "deid")
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      return rcall("DEL", deduplicationKey)
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobKey, jobId)
  end
  removeJobKeys(jobKey)
end
--[[
  Function to store a job scheduler
]]
local function storeJobScheduler(schedulerId, schedulerKey, repeatKey, nextMillis, opts,
  templateData, templateOpts)
  rcall("ZADD", repeatKey, nextMillis, schedulerId)
  local optionalValues = {}
  if opts['tz'] then
    table.insert(optionalValues, "tz")
    table.insert(optionalValues, opts['tz'])
  end
  if opts['limit'] then
    table.insert(optionalValues, "limit")
    table.insert(optionalValues, opts['limit'])
  end
  if opts['pattern'] then
    table.insert(optionalValues, "pattern")
    table.insert(optionalValues, opts['pattern'])
  end
  if opts['startDate'] then
    table.insert(optionalValues, "startDate")
    table.insert(optionalValues, opts['startDate'])
  end
  if opts['endDate'] then
    table.insert(optionalValues, "endDate")
    table.insert(optionalValues, opts['endDate'])
  end
  if opts['every'] then
    table.insert(optionalValues, "every")
    table.insert(optionalValues, opts['every'])
  end
  if opts['offset'] then
    table.insert(optionalValues, "offset")
    table.insert(optionalValues, opts['offset'])
  else
    local offset = rcall("HGET", schedulerKey, "offset")
    if offset then
      table.insert(optionalValues, "offset")
      table.insert(optionalValues, tonumber(offset))
    end
  end
  local jsonTemplateOpts = cjson.encode(templateOpts)
  if jsonTemplateOpts and jsonTemplateOpts ~= '{}' then
    table.insert(optionalValues, "opts")
    table.insert(optionalValues, jsonTemplateOpts)
  end
  if templateData and templateData ~= '{}' then
    table.insert(optionalValues, "data")
    table.insert(optionalValues, templateData)
  end
  table.insert(optionalValues, "ic")
  table.insert(optionalValues, rcall("HGET", schedulerKey, "ic") or 1)
  rcall("DEL", schedulerKey) -- remove all attributes and then re-insert new ones
  rcall("HMSET", schedulerKey, "name", opts['name'], unpack(optionalValues))
end
local function getJobSchedulerEveryNextMillis(prevMillis, every, now, offset, startDate)
    local nextMillis
    if not prevMillis then
        if startDate then
            -- Assuming startDate is passed as milliseconds from JavaScript
            nextMillis = tonumber(startDate)
            nextMillis = nextMillis > now and nextMillis or now
        else
            nextMillis = now
        end
    else
        nextMillis = prevMillis + every
        -- check if we may have missed some iterations
        if nextMillis < now then
            nextMillis = math.floor(now / every) * every + every + (offset or 0)
        end
    end
    if not offset or offset == 0 then
        local timeSlot = math.floor(nextMillis / every) * every;
        offset = nextMillis - timeSlot;
    end
    -- Return a tuple nextMillis, offset
    return math.floor(nextMillis), math.floor(offset)
end
-- If we are overriding a repeatable job we must delete the delayed job for
-- the next iteration.
local schedulerKey = repeatKey .. ":" .. jobSchedulerId
local maxEvents = getOrSetMaxEvents(metaKey)
local templateData = ARGV[4]
local prevMillis = rcall("ZSCORE", repeatKey, jobSchedulerId)
if prevMillis then
    prevMillis = tonumber(prevMillis)
end
local schedulerOpts = cmsgpack.unpack(ARGV[2])
local every = schedulerOpts['every']
-- For backwards compatibility we also check the offset from the job itself.
-- could be removed in future major versions.
local jobOffset = jobOpts['repeat'] and jobOpts['repeat']['offset'] or 0
local offset = schedulerOpts['offset'] or jobOffset or 0
local newOffset = offset
local updatedEvery = false
if every then
    -- if we changed the 'every' value we need to reset millis to nil
    local millis = prevMillis
    if prevMillis then
        local prevEvery = tonumber(rcall("HGET", schedulerKey, "every"))
        if prevEvery ~= every then
            millis = nil
            updatedEvery = true
        end
    end
    local startDate = schedulerOpts['startDate']
    nextMillis, newOffset = getJobSchedulerEveryNextMillis(millis, every, now, offset, startDate)
end
local function removeJobFromScheduler(prefixKey, delayedKey, prioritizedKey, waitKey, pausedKey, jobId, metaKey,
    eventsKey)
    if rcall("ZSCORE", delayedKey, jobId) then
        removeJob(jobId, true, prefixKey, true --[[remove debounce key]] )
        rcall("ZREM", delayedKey, jobId)
        return true
    elseif rcall("ZSCORE", prioritizedKey, jobId) then
        removeJob(jobId, true, prefixKey, true --[[remove debounce key]] )
        rcall("ZREM", prioritizedKey, jobId)
        return true
    else
        local pausedOrWaitKey = waitKey
        if isQueuePaused(metaKey) then
            pausedOrWaitKey = pausedKey
        end
        if rcall("LREM", pausedOrWaitKey, 1, jobId) > 0 then
            removeJob(jobId, true, prefixKey, true --[[remove debounce key]] )
            return true
        end
    end
    return false
end
local removedPrevJob = false
if prevMillis then
    local currentJobId = "repeat:" .. jobSchedulerId .. ":" .. prevMillis
    local currentJobKey = schedulerKey .. ":" .. prevMillis
    -- In theory it should always exist the currentJobKey if there is a prevMillis unless something has
    -- gone really wrong.
    if rcall("EXISTS", currentJobKey) == 1 then
        removedPrevJob = removeJobFromScheduler(prefixKey, delayedKey, prioritizedKey, waitKey, pausedKey, currentJobId,
            metaKey, eventsKey)
    end
end
if removedPrevJob then
    -- The jobs has been removed and we want to replace it, so lets use the same millis.
    if every and not updatedEvery then
        nextMillis = prevMillis
    end
else
    -- Special case where no job was removed, and we need to add the next iteration.
    schedulerOpts['offset'] = newOffset
end
-- Check for job ID collision with existing jobs (in any state)
local jobId = "repeat:" .. jobSchedulerId .. ":" .. nextMillis
local jobKey = prefixKey .. jobId
-- If there's already a job with this ID, in a state 
-- that is not updatable (active, completed, failed) we must 
-- handle the collision
local hasCollision = false
if rcall("EXISTS", jobKey) == 1 then
    if every then
        -- For 'every' case: try next time slot to avoid collision
        local nextSlotMillis = nextMillis + every
        local nextSlotJobId = "repeat:" .. jobSchedulerId .. ":" .. nextSlotMillis
        local nextSlotJobKey = prefixKey .. nextSlotJobId
        if rcall("EXISTS", nextSlotJobKey) == 0 then
            -- Next slot is free, use it
            nextMillis = nextSlotMillis
            jobId = nextSlotJobId
        else
            -- Next slot also has a job, return error code
            return -11 -- SchedulerJobSlotsBusy
        end
    else
        hasCollision = true
    end
end
local delay = nextMillis - now
-- Fast Clamp delay to minimum of 0
if delay < 0 then
    delay = 0
end
local nextJobKey = schedulerKey .. ":" .. nextMillis
if not hasCollision or removedPrevJob then
    -- jobId already calculated above during collision check
    storeJobScheduler(jobSchedulerId, schedulerKey, repeatKey, nextMillis, schedulerOpts, templateData, templateOpts)
    rcall("INCR", KEYS[8])
    addJobFromScheduler(nextJobKey, jobId, jobOpts, waitKey, pausedKey, KEYS[11], metaKey, prioritizedKey, KEYS[10],
        delayedKey, KEYS[7], eventsKey, schedulerOpts['name'], maxEvents, now, templateData, jobSchedulerId, delay)
elseif hasCollision then
    -- For 'pattern' case: return error code
    return -10 -- SchedulerJobIdCollision
end
if ARGV[9] ~= "" then
    rcall("HSET", ARGV[9], "nrjid", jobId)
end
return {jobId .. "", delay}
`;t.addJobScheduler={name:"addJobScheduler",content:r,keys:11}},23864:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addLog=void 0;let r=`--[[
  Add job log
  Input:
    KEYS[1] job id key
    KEYS[2] job logs key
    ARGV[1] id
    ARGV[2] log
    ARGV[3] keepLogs
  Output:
    -1 - Missing job.
]]
local rcall = redis.call
if rcall("EXISTS", KEYS[1]) == 1 then -- // Make sure job exists
  local logCount = rcall("RPUSH", KEYS[2], ARGV[2])
  if ARGV[3] ~= '' then
    local keepLogs = tonumber(ARGV[3])
    rcall("LTRIM", KEYS[2], -keepLogs, -1)
    return math.min(keepLogs, logCount)
  end
  return logCount
else
  return -1
end
`;t.addLog={name:"addLog",content:r,keys:2}},32401:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addParentJob=void 0;let r=`--[[
  Adds a parent job to the queue by doing the following:
    - Increases the job counter if needed.
    - Creates a new job key with the job data.
    - adds the job to the waiting-children zset
    Input:
      KEYS[1] 'meta'
      KEYS[2] 'id'
      KEYS[3] 'delayed'
      KEYS[4] 'waiting-children'
      KEYS[5] 'completed'
      KEYS[6] events stream key
      ARGV[1] msgpacked arguments array
            [1]  key prefix,
            [2]  custom id (will not generate one automatically)
            [3]  name
            [4]  timestamp
            [5]  parentKey?
            [6]  parent dependencies key.
            [7]  parent? {id, queueKey}
            [8]  repeat job key
            [9] deduplication key
      ARGV[2] Json stringified job data
      ARGV[3] msgpacked options
      Output:
        jobId  - OK
        -5     - Missing parent key
]]
local metaKey = KEYS[1]
local idKey = KEYS[2]
local completedKey = KEYS[5]
local eventsKey = KEYS[6]
local jobId
local jobIdKey
local rcall = redis.call
local args = cmsgpack.unpack(ARGV[1])
local data = ARGV[2]
local opts = cmsgpack.unpack(ARGV[3])
local parentKey = args[5]
local parent = args[7]
local repeatJobKey = args[8]
local deduplicationKey = args[9]
local parentData
-- Includes
--[[
  Function to debounce a job.
]]
-- Includes
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
local function removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents, currentDeduplicatedJobId,
    jobId, deduplicationId, prefix)
    if rcall("ZREM", delayedKey, currentDeduplicatedJobId) > 0 then
        removeJobKeys(prefix .. currentDeduplicatedJobId)
        rcall("XADD", eventsKey, "*", "event", "removed", "jobId", currentDeduplicatedJobId,
            "prev", "delayed")
        -- TODO remove debounced event in next breaking change
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
            jobId, "debounceId", deduplicationId)
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
            jobId, "deduplicationId", deduplicationId, "deduplicatedJobId", currentDeduplicatedJobId)
        return true
    end
    return false
end
local function deduplicateJob(deduplicationOpts, jobId, delayedKey, deduplicationKey, eventsKey, maxEvents,
    prefix)
    local deduplicationId = deduplicationOpts and deduplicationOpts['id']
    if deduplicationId then
        local ttl = deduplicationOpts['ttl']
        if deduplicationOpts['replace'] then
            if ttl and ttl > 0 then
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                if currentDebounceJobId then
                    local isRemoved = removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents,
                        currentDebounceJobId, jobId, deduplicationId, prefix)
                    if isRemoved then
                        if deduplicationOpts['extend'] then
                            rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                        else
                            rcall('SET', deduplicationKey, jobId, 'KEEPTTL')
                        end
                        return
                    else
                        return currentDebounceJobId
                    end
                else
                    rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                    return
                end
            else
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                if currentDebounceJobId then
                    local isRemoved = removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents,
                        currentDebounceJobId, jobId, deduplicationId, prefix)
                    if isRemoved then
                        rcall('SET', deduplicationKey, jobId)
                        return
                    else
                        return currentDebounceJobId
                    end
                else
                    rcall('SET', deduplicationKey, jobId)
                    return
                end
            end
        else
            local deduplicationKeyExists
            if ttl and ttl > 0 then
                if deduplicationOpts['extend'] then
                    local currentDebounceJobId = rcall('GET', deduplicationKey)
                    if currentDebounceJobId then
                        rcall('SET', deduplicationKey, currentDebounceJobId, 'PX', ttl)
                        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced",
                            "jobId", currentDebounceJobId, "debounceId", deduplicationId)
                        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                            currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                        return currentDebounceJobId
                    else
                        rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                        return
                    end
                else
                    deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'PX', ttl, 'NX')
                end
            else
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
            end
            if deduplicationKeyExists then
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                -- TODO remove debounced event in next breaking change
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
                    currentDebounceJobId, "debounceId", deduplicationId)
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                    currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                return currentDebounceJobId
            end
        end
    end
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to handle the case when job is duplicated.
]]
-- Includes
--[[
    This function is used to update the parent's dependencies if the job
    is already completed and about to be ignored. The parent must get its
    dependencies updated to avoid the parent job being stuck forever in 
    the waiting-children state.
]]
-- Includes
--[[
  Validate and move or add dependencies to parent.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized)
  if no pending dependencies.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized) if needed.
]]
-- Includes
--[[
  Move parent to a wait status (wait, prioritized or delayed)
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    local parentWaitKey = parentQueueKey .. ":wait"
    local parentPausedKey = parentQueueKey .. ":paused"
    local parentActiveKey = parentQueueKey .. ":active"
    local parentMetaKey = parentQueueKey .. ":meta"
    local parentMarkerKey = parentQueueKey .. ":marker"
    local jobAttributes = rcall("HMGET", parentKey, "priority", "delay")
    local priority = tonumber(jobAttributes[1]) or 0
    local delay = tonumber(jobAttributes[2]) or 0
    if delay > 0 then
        local delayedTimestamp = tonumber(timestamp) + delay
        local score = delayedTimestamp * 0x1000
        local parentDelayedKey = parentQueueKey .. ":delayed"
        rcall("ZADD", parentDelayedKey, score, parentId)
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "delayed", "jobId", parentId, "delay",
            delayedTimestamp)
        addDelayMarkerIfNeeded(parentMarkerKey, parentDelayedKey)
    else
        if priority == 0 then
            local parentTarget, isParentPausedOrMaxed = getTargetQueueList(parentMetaKey, parentActiveKey,
                parentWaitKey, parentPausedKey)
            addJobInTargetList(parentTarget, parentMarkerKey, "RPUSH", isParentPausedOrMaxed, parentId)
        else
            local isPausedOrMaxed = isQueuePausedOrMaxed(parentMetaKey, parentActiveKey)
            addJobWithPriority(parentMarkerKey, parentQueueKey .. ":prioritized", priority, parentId,
                parentQueueKey .. ":pc", isPausedOrMaxed)
        end
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "waiting", "jobId", parentId, "prev",
            "waiting-children")
    end
end
local function moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then    
      rcall("ZREM", parentWaitingChildrenKey, parentId)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    end
  end
end
local function moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey,
  parentId, timestamp)
  local doNotHavePendingDependencies = rcall("SCARD", parentDependenciesKey) == 0
  if doNotHavePendingDependencies then
    moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  end
end
local function updateParentDepsIfNeeded(parentKey, parentQueueKey, parentDependenciesKey,
  parentId, jobIdKey, returnvalue, timestamp )
  local processedSet = parentKey .. ":processed"
  rcall("HSET", processedSet, jobIdKey, returnvalue)
  moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey, parentId, timestamp)
end
local function updateExistingJobsParent(parentKey, parent, parentData,
                                        parentDependenciesKey, completedKey,
                                        jobIdKey, jobId, timestamp)
    if parentKey ~= nil then
        if rcall("ZSCORE", completedKey, jobId) then
            local returnvalue = rcall("HGET", jobIdKey, "returnvalue")
            updateParentDepsIfNeeded(parentKey, parent['queueKey'],
                                     parentDependenciesKey, parent['id'],
                                     jobIdKey, returnvalue, timestamp)
        else
            if parentDependenciesKey ~= nil then
                rcall("SADD", parentDependenciesKey, jobIdKey)
            end
        end
        rcall("HMSET", jobIdKey, "parentKey", parentKey, "parent", parentData)
    end
end
local function handleDuplicatedJob(jobKey, jobId, currentParentKey, currentParent,
  parentData, parentDependenciesKey, completedKey, eventsKey, maxEvents, timestamp)
  local existedParentKey = rcall("HGET", jobKey, "parentKey")
  if not existedParentKey or existedParentKey == currentParentKey then
    updateExistingJobsParent(currentParentKey, currentParent, parentData,
      parentDependenciesKey, completedKey, jobKey,
      jobId, timestamp)
  else
    if currentParentKey ~= nil and currentParentKey ~= existedParentKey
      and (rcall("EXISTS", existedParentKey) == 1) then
      return -7
    end
  end
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event",
    "duplicated", "jobId", jobId)
  return jobId .. "" -- convert to string
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
if parentKey ~= nil then
    if rcall("EXISTS", parentKey) ~= 1 then return -5 end
    parentData = cjson.encode(parent)
end
local jobCounter = rcall("INCR", idKey)
local maxEvents = getOrSetMaxEvents(metaKey)
local parentDependenciesKey = args[6]
local timestamp = args[4]
if args[2] == "" then
    jobId = jobCounter
    jobIdKey = args[1] .. jobId
else
    jobId = args[2]
    jobIdKey = args[1] .. jobId
    if rcall("EXISTS", jobIdKey) == 1 then
        return handleDuplicatedJob(jobIdKey, jobId, parentKey, parent,
            parentData, parentDependenciesKey, completedKey, eventsKey,
            maxEvents, timestamp)
    end
end
local deduplicationJobId = deduplicateJob(opts['de'], jobId, KEYS[3],
  deduplicationKey, eventsKey, maxEvents, args[1])
if deduplicationJobId then
  return deduplicationJobId
end
-- Store the job.
storeJob(eventsKey, jobIdKey, jobId, args[3], ARGV[2], opts, timestamp,
         parentKey, parentData, repeatJobKey)
local waitChildrenKey = KEYS[4]
rcall("ZADD", waitChildrenKey, timestamp, jobId)
rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event",
      "waiting-children", "jobId", jobId)
-- Check if this job is a child of another job, if so add it to the parents dependencies
if parentDependenciesKey ~= nil then
    rcall("SADD", parentDependenciesKey, jobIdKey)
end
return jobId .. "" -- convert to string
`;t.addParentJob={name:"addParentJob",content:r,keys:6}},78045:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addPrioritizedJob=void 0;let r=`--[[
  Adds a priotitized job to the queue by doing the following:
    - Increases the job counter if needed.
    - Creates a new job key with the job data.
    - Adds the job to the "added" list so that workers gets notified.
    Input:
      KEYS[1] 'marker',
      KEYS[2] 'meta'
      KEYS[3] 'id'
      KEYS[4] 'prioritized'
      KEYS[5] 'delayed'
      KEYS[6] 'completed'
      KEYS[7] 'active'
      KEYS[8] events stream key
      KEYS[9] 'pc' priority counter
      ARGV[1] msgpacked arguments array
            [1]  key prefix,
            [2]  custom id (will not generate one automatically)
            [3]  name
            [4]  timestamp
            [5]  parentKey?
            [6]  parent dependencies key.
            [7]  parent? {id, queueKey}
            [8]  repeat job key
            [9] deduplication key
      ARGV[2] Json stringified job data
      ARGV[3] msgpacked options
      Output:
        jobId  - OK
        -5     - Missing parent key
]] 
local metaKey = KEYS[2]
local idKey = KEYS[3]
local priorityKey = KEYS[4]
local completedKey = KEYS[6]
local activeKey = KEYS[7]
local eventsKey = KEYS[8]
local priorityCounterKey = KEYS[9]
local jobId
local jobIdKey
local rcall = redis.call
local args = cmsgpack.unpack(ARGV[1])
local data = ARGV[2]
local opts = cmsgpack.unpack(ARGV[3])
local parentKey = args[5]
local parent = args[7]
local repeatJobKey = args[8]
local deduplicationKey = args[9]
local parentData
-- Includes
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to debounce a job.
]]
-- Includes
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
local function removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents, currentDeduplicatedJobId,
    jobId, deduplicationId, prefix)
    if rcall("ZREM", delayedKey, currentDeduplicatedJobId) > 0 then
        removeJobKeys(prefix .. currentDeduplicatedJobId)
        rcall("XADD", eventsKey, "*", "event", "removed", "jobId", currentDeduplicatedJobId,
            "prev", "delayed")
        -- TODO remove debounced event in next breaking change
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
            jobId, "debounceId", deduplicationId)
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
            jobId, "deduplicationId", deduplicationId, "deduplicatedJobId", currentDeduplicatedJobId)
        return true
    end
    return false
end
local function deduplicateJob(deduplicationOpts, jobId, delayedKey, deduplicationKey, eventsKey, maxEvents,
    prefix)
    local deduplicationId = deduplicationOpts and deduplicationOpts['id']
    if deduplicationId then
        local ttl = deduplicationOpts['ttl']
        if deduplicationOpts['replace'] then
            if ttl and ttl > 0 then
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                if currentDebounceJobId then
                    local isRemoved = removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents,
                        currentDebounceJobId, jobId, deduplicationId, prefix)
                    if isRemoved then
                        if deduplicationOpts['extend'] then
                            rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                        else
                            rcall('SET', deduplicationKey, jobId, 'KEEPTTL')
                        end
                        return
                    else
                        return currentDebounceJobId
                    end
                else
                    rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                    return
                end
            else
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                if currentDebounceJobId then
                    local isRemoved = removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents,
                        currentDebounceJobId, jobId, deduplicationId, prefix)
                    if isRemoved then
                        rcall('SET', deduplicationKey, jobId)
                        return
                    else
                        return currentDebounceJobId
                    end
                else
                    rcall('SET', deduplicationKey, jobId)
                    return
                end
            end
        else
            local deduplicationKeyExists
            if ttl and ttl > 0 then
                if deduplicationOpts['extend'] then
                    local currentDebounceJobId = rcall('GET', deduplicationKey)
                    if currentDebounceJobId then
                        rcall('SET', deduplicationKey, currentDebounceJobId, 'PX', ttl)
                        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced",
                            "jobId", currentDebounceJobId, "debounceId", deduplicationId)
                        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                            currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                        return currentDebounceJobId
                    else
                        rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                        return
                    end
                else
                    deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'PX', ttl, 'NX')
                end
            else
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
            end
            if deduplicationKeyExists then
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                -- TODO remove debounced event in next breaking change
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
                    currentDebounceJobId, "debounceId", deduplicationId)
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                    currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                return currentDebounceJobId
            end
        end
    end
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to handle the case when job is duplicated.
]]
-- Includes
--[[
    This function is used to update the parent's dependencies if the job
    is already completed and about to be ignored. The parent must get its
    dependencies updated to avoid the parent job being stuck forever in 
    the waiting-children state.
]]
-- Includes
--[[
  Validate and move or add dependencies to parent.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized)
  if no pending dependencies.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized) if needed.
]]
-- Includes
--[[
  Move parent to a wait status (wait, prioritized or delayed)
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    local parentWaitKey = parentQueueKey .. ":wait"
    local parentPausedKey = parentQueueKey .. ":paused"
    local parentActiveKey = parentQueueKey .. ":active"
    local parentMetaKey = parentQueueKey .. ":meta"
    local parentMarkerKey = parentQueueKey .. ":marker"
    local jobAttributes = rcall("HMGET", parentKey, "priority", "delay")
    local priority = tonumber(jobAttributes[1]) or 0
    local delay = tonumber(jobAttributes[2]) or 0
    if delay > 0 then
        local delayedTimestamp = tonumber(timestamp) + delay
        local score = delayedTimestamp * 0x1000
        local parentDelayedKey = parentQueueKey .. ":delayed"
        rcall("ZADD", parentDelayedKey, score, parentId)
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "delayed", "jobId", parentId, "delay",
            delayedTimestamp)
        addDelayMarkerIfNeeded(parentMarkerKey, parentDelayedKey)
    else
        if priority == 0 then
            local parentTarget, isParentPausedOrMaxed = getTargetQueueList(parentMetaKey, parentActiveKey,
                parentWaitKey, parentPausedKey)
            addJobInTargetList(parentTarget, parentMarkerKey, "RPUSH", isParentPausedOrMaxed, parentId)
        else
            local isPausedOrMaxed = isQueuePausedOrMaxed(parentMetaKey, parentActiveKey)
            addJobWithPriority(parentMarkerKey, parentQueueKey .. ":prioritized", priority, parentId,
                parentQueueKey .. ":pc", isPausedOrMaxed)
        end
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "waiting", "jobId", parentId, "prev",
            "waiting-children")
    end
end
local function moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then    
      rcall("ZREM", parentWaitingChildrenKey, parentId)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    end
  end
end
local function moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey,
  parentId, timestamp)
  local doNotHavePendingDependencies = rcall("SCARD", parentDependenciesKey) == 0
  if doNotHavePendingDependencies then
    moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  end
end
local function updateParentDepsIfNeeded(parentKey, parentQueueKey, parentDependenciesKey,
  parentId, jobIdKey, returnvalue, timestamp )
  local processedSet = parentKey .. ":processed"
  rcall("HSET", processedSet, jobIdKey, returnvalue)
  moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey, parentId, timestamp)
end
local function updateExistingJobsParent(parentKey, parent, parentData,
                                        parentDependenciesKey, completedKey,
                                        jobIdKey, jobId, timestamp)
    if parentKey ~= nil then
        if rcall("ZSCORE", completedKey, jobId) then
            local returnvalue = rcall("HGET", jobIdKey, "returnvalue")
            updateParentDepsIfNeeded(parentKey, parent['queueKey'],
                                     parentDependenciesKey, parent['id'],
                                     jobIdKey, returnvalue, timestamp)
        else
            if parentDependenciesKey ~= nil then
                rcall("SADD", parentDependenciesKey, jobIdKey)
            end
        end
        rcall("HMSET", jobIdKey, "parentKey", parentKey, "parent", parentData)
    end
end
local function handleDuplicatedJob(jobKey, jobId, currentParentKey, currentParent,
  parentData, parentDependenciesKey, completedKey, eventsKey, maxEvents, timestamp)
  local existedParentKey = rcall("HGET", jobKey, "parentKey")
  if not existedParentKey or existedParentKey == currentParentKey then
    updateExistingJobsParent(currentParentKey, currentParent, parentData,
      parentDependenciesKey, completedKey, jobKey,
      jobId, timestamp)
  else
    if currentParentKey ~= nil and currentParentKey ~= existedParentKey
      and (rcall("EXISTS", existedParentKey) == 1) then
      return -7
    end
  end
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event",
    "duplicated", "jobId", jobId)
  return jobId .. "" -- convert to string
end
if parentKey ~= nil then
    if rcall("EXISTS", parentKey) ~= 1 then return -5 end
    parentData = cjson.encode(parent)
end
local jobCounter = rcall("INCR", idKey)
local maxEvents = getOrSetMaxEvents(metaKey)
local parentDependenciesKey = args[6]
local timestamp = args[4]
if args[2] == "" then
    jobId = jobCounter
    jobIdKey = args[1] .. jobId
else
    jobId = args[2]
    jobIdKey = args[1] .. jobId
    if rcall("EXISTS", jobIdKey) == 1 then
        return handleDuplicatedJob(jobIdKey, jobId, parentKey, parent,
            parentData, parentDependenciesKey, completedKey, eventsKey,
            maxEvents, timestamp)
    end
end
local deduplicationJobId = deduplicateJob(opts['de'], jobId, KEYS[5],
  deduplicationKey, eventsKey, maxEvents, args[1])
if deduplicationJobId then
  return deduplicationJobId
end
-- Store the job.
local delay, priority = storeJob(eventsKey, jobIdKey, jobId, args[3], ARGV[2],
                                 opts, timestamp, parentKey, parentData,
                                 repeatJobKey)
-- Add the job to the prioritized set
local isPausedOrMaxed = isQueuePausedOrMaxed(metaKey, activeKey)
addJobWithPriority( KEYS[1], priorityKey, priority, jobId, priorityCounterKey, isPausedOrMaxed)
-- Emit waiting event
rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "waiting",
      "jobId", jobId)
-- Check if this job is a child of another job, if so add it to the parents dependencies
if parentDependenciesKey ~= nil then
    rcall("SADD", parentDependenciesKey, jobIdKey)
end
return jobId .. "" -- convert to string
`;t.addPrioritizedJob={name:"addPrioritizedJob",content:r,keys:9}},86182:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addRepeatableJob=void 0;let r=`--[[
  Adds a repeatable job
    Input:
      KEYS[1] 'repeat' key
      KEYS[2] 'delayed' key
      ARGV[1] next milliseconds
      ARGV[2] msgpacked options
            [1]  name
            [2]  tz?
            [3]  pattern?
            [4]  endDate?
            [5]  every?
      ARGV[3] legacy custom key TODO: remove this logic in next breaking change
      ARGV[4] custom key
      ARGV[5] prefix key
      Output:
        repeatableKey  - OK
]]
local rcall = redis.call
local repeatKey = KEYS[1]
local delayedKey = KEYS[2]
local nextMillis = ARGV[1]
local legacyCustomKey = ARGV[3]
local customKey = ARGV[4]
local prefixKey = ARGV[5]
-- Includes
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobKey, jobId)
  local deduplicationId = rcall("HGET", jobKey, "deid")
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      return rcall("DEL", deduplicationKey)
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobKey, jobId)
  end
  removeJobKeys(jobKey)
end
local function storeRepeatableJob(repeatKey, customKey, nextMillis, rawOpts)
  rcall("ZADD", repeatKey, nextMillis, customKey)
  local opts = cmsgpack.unpack(rawOpts)
  local optionalValues = {}
  if opts['tz'] then
    table.insert(optionalValues, "tz")
    table.insert(optionalValues, opts['tz'])
  end
  if opts['pattern'] then
    table.insert(optionalValues, "pattern")
    table.insert(optionalValues, opts['pattern'])
  end
  if opts['endDate'] then
    table.insert(optionalValues, "endDate")
    table.insert(optionalValues, opts['endDate'])
  end
  if opts['every'] then
    table.insert(optionalValues, "every")
    table.insert(optionalValues, opts['every'])
  end
  rcall("HMSET", repeatKey .. ":" .. customKey, "name", opts['name'],
    unpack(optionalValues))
  return customKey
end
-- If we are overriding a repeatable job we must delete the delayed job for
-- the next iteration.
local prevMillis = rcall("ZSCORE", repeatKey, customKey)
if prevMillis then
  local delayedJobId =  "repeat:" .. customKey .. ":" .. prevMillis
  local nextDelayedJobId =  repeatKey .. ":" .. customKey .. ":" .. nextMillis
  if rcall("ZSCORE", delayedKey, delayedJobId)
   and rcall("EXISTS", nextDelayedJobId) ~= 1 then
    removeJob(delayedJobId, true, prefixKey, true --[[remove debounce key]])
    rcall("ZREM", delayedKey, delayedJobId)
  end
end
-- Keep backwards compatibility with old repeatable jobs (<= 3.0.0)
if rcall("ZSCORE", repeatKey, legacyCustomKey) ~= false then
  return storeRepeatableJob(repeatKey, legacyCustomKey, nextMillis, ARGV[2])
end
return storeRepeatableJob(repeatKey, customKey, nextMillis, ARGV[2])
`;t.addRepeatableJob={name:"addRepeatableJob",content:r,keys:2}},53411:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addStandardJob=void 0;let r=`--[[
  Adds a job to the queue by doing the following:
    - Increases the job counter if needed.
    - Creates a new job key with the job data.
    - if delayed:
      - computes timestamp.
      - adds to delayed zset.
      - Emits a global event 'delayed' if the job is delayed.
    - if not delayed
      - Adds the jobId to the wait/paused list in one of three ways:
         - LIFO
         - FIFO
         - prioritized.
      - Adds the job to the "added" list so that workers gets notified.
    Input:
      KEYS[1] 'wait',
      KEYS[2] 'paused'
      KEYS[3] 'meta'
      KEYS[4] 'id'
      KEYS[5] 'completed'
      KEYS[6] 'delayed'
      KEYS[7] 'active'
      KEYS[8] events stream key
      KEYS[9] marker key
      ARGV[1] msgpacked arguments array
            [1]  key prefix,
            [2]  custom id (will not generate one automatically)
            [3]  name
            [4]  timestamp
            [5]  parentKey?
            [6]  parent dependencies key.
            [7]  parent? {id, queueKey}
            [8]  repeat job key
            [9] deduplication key
      ARGV[2] Json stringified job data
      ARGV[3] msgpacked options
      Output:
        jobId  - OK
        -5     - Missing parent key
]]
local eventsKey = KEYS[8]
local jobId
local jobIdKey
local rcall = redis.call
local args = cmsgpack.unpack(ARGV[1])
local data = ARGV[2]
local opts = cmsgpack.unpack(ARGV[3])
local parentKey = args[5]
local parent = args[7]
local repeatJobKey = args[8]
local deduplicationKey = args[9]
local parentData
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to debounce a job.
]]
-- Includes
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
local function removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents, currentDeduplicatedJobId,
    jobId, deduplicationId, prefix)
    if rcall("ZREM", delayedKey, currentDeduplicatedJobId) > 0 then
        removeJobKeys(prefix .. currentDeduplicatedJobId)
        rcall("XADD", eventsKey, "*", "event", "removed", "jobId", currentDeduplicatedJobId,
            "prev", "delayed")
        -- TODO remove debounced event in next breaking change
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
            jobId, "debounceId", deduplicationId)
        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
            jobId, "deduplicationId", deduplicationId, "deduplicatedJobId", currentDeduplicatedJobId)
        return true
    end
    return false
end
local function deduplicateJob(deduplicationOpts, jobId, delayedKey, deduplicationKey, eventsKey, maxEvents,
    prefix)
    local deduplicationId = deduplicationOpts and deduplicationOpts['id']
    if deduplicationId then
        local ttl = deduplicationOpts['ttl']
        if deduplicationOpts['replace'] then
            if ttl and ttl > 0 then
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                if currentDebounceJobId then
                    local isRemoved = removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents,
                        currentDebounceJobId, jobId, deduplicationId, prefix)
                    if isRemoved then
                        if deduplicationOpts['extend'] then
                            rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                        else
                            rcall('SET', deduplicationKey, jobId, 'KEEPTTL')
                        end
                        return
                    else
                        return currentDebounceJobId
                    end
                else
                    rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                    return
                end
            else
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                if currentDebounceJobId then
                    local isRemoved = removeDelayedJob(delayedKey, deduplicationKey, eventsKey, maxEvents,
                        currentDebounceJobId, jobId, deduplicationId, prefix)
                    if isRemoved then
                        rcall('SET', deduplicationKey, jobId)
                        return
                    else
                        return currentDebounceJobId
                    end
                else
                    rcall('SET', deduplicationKey, jobId)
                    return
                end
            end
        else
            local deduplicationKeyExists
            if ttl and ttl > 0 then
                if deduplicationOpts['extend'] then
                    local currentDebounceJobId = rcall('GET', deduplicationKey)
                    if currentDebounceJobId then
                        rcall('SET', deduplicationKey, currentDebounceJobId, 'PX', ttl)
                        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced",
                            "jobId", currentDebounceJobId, "debounceId", deduplicationId)
                        rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                            currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                        return currentDebounceJobId
                    else
                        rcall('SET', deduplicationKey, jobId, 'PX', ttl)
                        return
                    end
                else
                    deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'PX', ttl, 'NX')
                end
            else
                deduplicationKeyExists = not rcall('SET', deduplicationKey, jobId, 'NX')
            end
            if deduplicationKeyExists then
                local currentDebounceJobId = rcall('GET', deduplicationKey)
                -- TODO remove debounced event in next breaking change
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "debounced", "jobId",
                    currentDebounceJobId, "debounceId", deduplicationId)
                rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "deduplicated", "jobId",
                    currentDebounceJobId, "deduplicationId", deduplicationId, "deduplicatedJobId", jobId)
                return currentDebounceJobId
            end
        end
    end
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to handle the case when job is duplicated.
]]
-- Includes
--[[
    This function is used to update the parent's dependencies if the job
    is already completed and about to be ignored. The parent must get its
    dependencies updated to avoid the parent job being stuck forever in 
    the waiting-children state.
]]
-- Includes
--[[
  Validate and move or add dependencies to parent.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized)
  if no pending dependencies.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized) if needed.
]]
-- Includes
--[[
  Move parent to a wait status (wait, prioritized or delayed)
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
local function moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    local parentWaitKey = parentQueueKey .. ":wait"
    local parentPausedKey = parentQueueKey .. ":paused"
    local parentActiveKey = parentQueueKey .. ":active"
    local parentMetaKey = parentQueueKey .. ":meta"
    local parentMarkerKey = parentQueueKey .. ":marker"
    local jobAttributes = rcall("HMGET", parentKey, "priority", "delay")
    local priority = tonumber(jobAttributes[1]) or 0
    local delay = tonumber(jobAttributes[2]) or 0
    if delay > 0 then
        local delayedTimestamp = tonumber(timestamp) + delay
        local score = delayedTimestamp * 0x1000
        local parentDelayedKey = parentQueueKey .. ":delayed"
        rcall("ZADD", parentDelayedKey, score, parentId)
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "delayed", "jobId", parentId, "delay",
            delayedTimestamp)
        addDelayMarkerIfNeeded(parentMarkerKey, parentDelayedKey)
    else
        if priority == 0 then
            local parentTarget, isParentPausedOrMaxed = getTargetQueueList(parentMetaKey, parentActiveKey,
                parentWaitKey, parentPausedKey)
            addJobInTargetList(parentTarget, parentMarkerKey, "RPUSH", isParentPausedOrMaxed, parentId)
        else
            local isPausedOrMaxed = isQueuePausedOrMaxed(parentMetaKey, parentActiveKey)
            addJobWithPriority(parentMarkerKey, parentQueueKey .. ":prioritized", priority, parentId,
                parentQueueKey .. ":pc", isPausedOrMaxed)
        end
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "waiting", "jobId", parentId, "prev",
            "waiting-children")
    end
end
local function moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then    
      rcall("ZREM", parentWaitingChildrenKey, parentId)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    end
  end
end
local function moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey,
  parentId, timestamp)
  local doNotHavePendingDependencies = rcall("SCARD", parentDependenciesKey) == 0
  if doNotHavePendingDependencies then
    moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  end
end
local function updateParentDepsIfNeeded(parentKey, parentQueueKey, parentDependenciesKey,
  parentId, jobIdKey, returnvalue, timestamp )
  local processedSet = parentKey .. ":processed"
  rcall("HSET", processedSet, jobIdKey, returnvalue)
  moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey, parentId, timestamp)
end
local function updateExistingJobsParent(parentKey, parent, parentData,
                                        parentDependenciesKey, completedKey,
                                        jobIdKey, jobId, timestamp)
    if parentKey ~= nil then
        if rcall("ZSCORE", completedKey, jobId) then
            local returnvalue = rcall("HGET", jobIdKey, "returnvalue")
            updateParentDepsIfNeeded(parentKey, parent['queueKey'],
                                     parentDependenciesKey, parent['id'],
                                     jobIdKey, returnvalue, timestamp)
        else
            if parentDependenciesKey ~= nil then
                rcall("SADD", parentDependenciesKey, jobIdKey)
            end
        end
        rcall("HMSET", jobIdKey, "parentKey", parentKey, "parent", parentData)
    end
end
local function handleDuplicatedJob(jobKey, jobId, currentParentKey, currentParent,
  parentData, parentDependenciesKey, completedKey, eventsKey, maxEvents, timestamp)
  local existedParentKey = rcall("HGET", jobKey, "parentKey")
  if not existedParentKey or existedParentKey == currentParentKey then
    updateExistingJobsParent(currentParentKey, currentParent, parentData,
      parentDependenciesKey, completedKey, jobKey,
      jobId, timestamp)
  else
    if currentParentKey ~= nil and currentParentKey ~= existedParentKey
      and (rcall("EXISTS", existedParentKey) == 1) then
      return -7
    end
  end
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event",
    "duplicated", "jobId", jobId)
  return jobId .. "" -- convert to string
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
if parentKey ~= nil then
    if rcall("EXISTS", parentKey) ~= 1 then return -5 end
    parentData = cjson.encode(parent)
end
local jobCounter = rcall("INCR", KEYS[4])
local metaKey = KEYS[3]
local maxEvents = getOrSetMaxEvents(metaKey)
local parentDependenciesKey = args[6]
local timestamp = args[4]
if args[2] == "" then
    jobId = jobCounter
    jobIdKey = args[1] .. jobId
else
    jobId = args[2]
    jobIdKey = args[1] .. jobId
    if rcall("EXISTS", jobIdKey) == 1 then
        return handleDuplicatedJob(jobIdKey, jobId, parentKey, parent,
            parentData, parentDependenciesKey, KEYS[5], eventsKey,
            maxEvents, timestamp)
    end
end
local deduplicationJobId = deduplicateJob(opts['de'], jobId, KEYS[6],
  deduplicationKey, eventsKey, maxEvents, args[1])
if deduplicationJobId then
  return deduplicationJobId
end
-- Store the job.
storeJob(eventsKey, jobIdKey, jobId, args[3], ARGV[2], opts, timestamp,
         parentKey, parentData, repeatJobKey)
local target, isPausedOrMaxed = getTargetQueueList(metaKey, KEYS[7], KEYS[1], KEYS[2])
-- LIFO or FIFO
local pushCmd = opts['lifo'] and 'RPUSH' or 'LPUSH'
addJobInTargetList(target, KEYS[9], pushCmd, isPausedOrMaxed, jobId)
-- Emit waiting event
rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "waiting",
      "jobId", jobId)
-- Check if this job is a child of another job, if so add it to the parents dependencies
if parentDependenciesKey ~= nil then
    rcall("SADD", parentDependenciesKey, jobIdKey)
end
return jobId .. "" -- convert to string
`;t.addStandardJob={name:"addStandardJob",content:r,keys:9}},79431:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.changeDelay=void 0;let r=`--[[
  Change job delay when it is in delayed set.
  Input:
    KEYS[1] delayed key
    KEYS[2] meta key
    KEYS[3] marker key
    KEYS[4] events stream
    ARGV[1] delay
    ARGV[2] timestamp
    ARGV[3] the id of the job
    ARGV[4] job key
  Output:
    0 - OK
   -1 - Missing job.
   -3 - Job not in delayed set.
  Events:
    - delayed key.
]]
local rcall = redis.call
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Bake in the job id first 12 bits into the timestamp
  to guarantee correct execution order of delayed jobs
  (up to 4096 jobs per given timestamp or 4096 jobs apart per timestamp)
  WARNING: Jobs that are so far apart that they wrap around will cause FIFO to fail
]]
local function getDelayedScore(delayedKey, timestamp, delay)
  local delayedTimestamp = (delay > 0 and (tonumber(timestamp) + delay)) or tonumber(timestamp)
  local minScore = delayedTimestamp * 0x1000
  local maxScore = (delayedTimestamp + 1 ) * 0x1000 - 1
  local result = rcall("ZREVRANGEBYSCORE", delayedKey, maxScore,
    minScore, "WITHSCORES","LIMIT", 0, 1)
  if #result then
    local currentMaxScore = tonumber(result[2])
    if currentMaxScore ~= nil then
      if currentMaxScore >= maxScore then
        return maxScore, delayedTimestamp
      else
        return currentMaxScore + 1, delayedTimestamp
      end
    end
  end
  return minScore, delayedTimestamp
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
if rcall("EXISTS", ARGV[4]) == 1 then
  local jobId = ARGV[3]
  local delay = tonumber(ARGV[1])
  local score, delayedTimestamp = getDelayedScore(KEYS[1], ARGV[2], delay)
  local numRemovedElements = rcall("ZREM", KEYS[1], jobId)
  if numRemovedElements < 1 then
    return -3
  end
  rcall("HSET", ARGV[4], "delay", delay)
  rcall("ZADD", KEYS[1], score, jobId)
  local maxEvents = getOrSetMaxEvents(KEYS[2])
  rcall("XADD", KEYS[4], "MAXLEN", "~", maxEvents, "*", "event", "delayed",
    "jobId", jobId, "delay", delayedTimestamp)
  -- mark that a delayed job is available
  addDelayMarkerIfNeeded(KEYS[3], KEYS[1])
  return 0
else
  return -1
end`;t.changeDelay={name:"changeDelay",content:r,keys:4}},3424:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.changePriority=void 0;let r=`--[[
  Change job priority
  Input:
    KEYS[1] 'wait',
    KEYS[2] 'paused'
    KEYS[3] 'meta'
    KEYS[4] 'prioritized'
    KEYS[5] 'active'
    KEYS[6] 'pc' priority counter
    KEYS[7] 'marker'
    ARGV[1] priority value
    ARGV[2] prefix key
    ARGV[3] job id
    ARGV[4] lifo
    Output:
       0  - OK
      -1  - Missing job
]]
local jobId = ARGV[3]
local jobKey = ARGV[2] .. jobId
local priority = tonumber(ARGV[1])
local rcall = redis.call
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to push back job considering priority in front of same prioritized jobs.
]]
local function pushBackJobWithPriority(prioritizedKey, priority, jobId)
  -- in order to put it at front of same prioritized jobs
  -- we consider prioritized counter as 0
  local score = priority * 0x100000000
  rcall("ZADD", prioritizedKey, score, jobId)
end
local function reAddJobWithNewPriority( prioritizedKey, markerKey, targetKey,
    priorityCounter, lifo, priority, jobId, isPausedOrMaxed)
    if priority == 0 then
        local pushCmd = lifo and 'RPUSH' or 'LPUSH'
        addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
    else
        if lifo then
            pushBackJobWithPriority(prioritizedKey, priority, jobId)
        else
            addJobWithPriority(markerKey, prioritizedKey, priority, jobId,
                priorityCounter, isPausedOrMaxed)
        end
    end
end
if rcall("EXISTS", jobKey) == 1 then
    local metaKey = KEYS[3]
    local target, isPausedOrMaxed = getTargetQueueList(metaKey, KEYS[5], KEYS[1], KEYS[2])
    local prioritizedKey = KEYS[4]
    local priorityCounterKey = KEYS[6]
    local markerKey = KEYS[7]
    -- Re-add with the new priority
    if rcall("ZREM", prioritizedKey, jobId) > 0 then
        reAddJobWithNewPriority( prioritizedKey, markerKey, target,
            priorityCounterKey, ARGV[4] == '1', priority, jobId, isPausedOrMaxed)
    elseif rcall("LREM", target, -1, jobId) > 0 then
        reAddJobWithNewPriority( prioritizedKey, markerKey, target,
            priorityCounterKey, ARGV[4] == '1', priority, jobId, isPausedOrMaxed)
    end
    rcall("HSET", jobKey, "priority", priority)
    return 0
else
    return -1
end
`;t.changePriority={name:"changePriority",content:r,keys:7}},9837:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.cleanJobsInSet=void 0;let r=`--[[
  Remove jobs from the specific set.
  Input:
    KEYS[1]  set key,
    KEYS[2]  events stream key
    KEYS[3]  repeat key
    ARGV[1]  jobKey prefix
    ARGV[2]  timestamp
    ARGV[3]  limit the number of jobs to be removed. 0 is unlimited
    ARGV[4]  set name, can be any of 'wait', 'active', 'paused', 'delayed', 'completed', or 'failed'
]]
local rcall = redis.call
local repeatKey = KEYS[3]
local rangeStart = 0
local rangeEnd = -1
local limit = tonumber(ARGV[3])
-- If we're only deleting _n_ items, avoid retrieving all items
-- for faster performance
--
-- Start from the tail of the list, since that's where oldest elements
-- are generally added for FIFO lists
if limit > 0 then
  rangeStart = -1 - limit + 1
  rangeEnd = -1
end
-- Includes
--[[
  Function to clean job list.
  Returns jobIds and deleted count number.
]]
-- Includes
--[[
  Function to get the latest saved timestamp.
]]
local function getTimestamp(jobKey, attributes)
  if #attributes == 1 then
    return rcall("HGET", jobKey, attributes[1])
  end
  local jobTs
  for _, ts in ipairs(rcall("HMGET", jobKey, unpack(attributes))) do
    if (ts) then
      jobTs = ts
      break
    end
  end
  return jobTs
end
--[[
  Function to check if the job belongs to a job scheduler and
  current delayed job matches with jobId
]]
local function isJobSchedulerJob(jobId, jobKey, jobSchedulersKey)
  local repeatJobKey = rcall("HGET", jobKey, "rjk")
  if repeatJobKey  then
    local prevMillis = rcall("ZSCORE", jobSchedulersKey, repeatJobKey)
    if prevMillis then
      local currentDelayedJobId = "repeat:" .. repeatJobKey .. ":" .. prevMillis
      return jobId == currentDelayedJobId
    end
  end
  return false
end
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobKey, jobId)
  local deduplicationId = rcall("HGET", jobKey, "deid")
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      return rcall("DEL", deduplicationKey)
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobKey, jobId)
  end
  removeJobKeys(jobKey)
end
local function cleanList(listKey, jobKeyPrefix, rangeStart, rangeEnd,
  timestamp, isWaiting, jobSchedulersKey)
  local jobs = rcall("LRANGE", listKey, rangeStart, rangeEnd)
  local deleted = {}
  local deletedCount = 0
  local jobTS
  local deletionMarker = ''
  local jobIdsLen = #jobs
  for i, job in ipairs(jobs) do
    if limit > 0 and deletedCount >= limit then
      break
    end
    local jobKey = jobKeyPrefix .. job
    if (isWaiting or rcall("EXISTS", jobKey .. ":lock") == 0) and
      not isJobSchedulerJob(job, jobKey, jobSchedulersKey) then
      -- Find the right timestamp of the job to compare to maxTimestamp:
      -- * finishedOn says when the job was completed, but it isn't set unless the job has actually completed
      -- * processedOn represents when the job was last attempted, but it doesn't get populated until
      --   the job is first tried
      -- * timestamp is the original job submission time
      -- Fetch all three of these (in that order) and use the first one that is set so that we'll leave jobs
      -- that have been active within the grace period:
      jobTS = getTimestamp(jobKey, {"finishedOn", "processedOn", "timestamp"})
      if (not jobTS or jobTS <= timestamp) then
        -- replace the entry with a deletion marker; the actual deletion will
        -- occur at the end of the script
        rcall("LSET", listKey, rangeEnd - jobIdsLen + i, deletionMarker)
        removeJob(job, true, jobKeyPrefix, true --[[remove debounce key]])
        deletedCount = deletedCount + 1
        table.insert(deleted, job)
      end
    end
  end
  rcall("LREM", listKey, 0, deletionMarker)
  return {deleted, deletedCount}
end
--[[
  Function to clean job set.
  Returns jobIds and deleted count number.
]] 
-- Includes
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
--[[
  We use ZRANGEBYSCORE to make the case where we're deleting a limited number
  of items in a sorted set only run a single iteration. If we simply used
  ZRANGE, we may take a long time traversing through jobs that are within the
  grace period.
]]
local function getJobsInZset(zsetKey, rangeEnd, limit)
  if limit > 0 then
    return rcall("ZRANGEBYSCORE", zsetKey, 0, rangeEnd, "LIMIT", 0, limit)
  else
    return rcall("ZRANGEBYSCORE", zsetKey, 0, rangeEnd)
  end
end
local function cleanSet(
    setKey,
    jobKeyPrefix,
    rangeEnd,
    timestamp,
    limit,
    attributes,
    isFinished,
    jobSchedulersKey)
    local jobs = getJobsInZset(setKey, rangeEnd, limit)
    local deleted = {}
    local deletedCount = 0
    local jobTS
    for i, job in ipairs(jobs) do
        if limit > 0 and deletedCount >= limit then
            break
        end
        local jobKey = jobKeyPrefix .. job
        -- Extract a Job Scheduler Id from jobId ("repeat:job-scheduler-id:millis") 
        -- and check if it is in the scheduled jobs
        if not (jobSchedulersKey and isJobSchedulerJob(job, jobKey, jobSchedulersKey)) then
            if isFinished then
                removeJob(job, true, jobKeyPrefix, true --[[remove debounce key]] )
                deletedCount = deletedCount + 1
                table.insert(deleted, job)
            else
                -- * finishedOn says when the job was completed, but it isn't set unless the job has actually completed
                jobTS = getTimestamp(jobKey, attributes)
                if (not jobTS or jobTS <= timestamp) then
                    removeJob(job, true, jobKeyPrefix, true --[[remove debounce key]] )
                    deletedCount = deletedCount + 1
                    table.insert(deleted, job)
                end
            end
        end
    end
    if (#deleted > 0) then
        for from, to in batches(#deleted, 7000) do
            rcall("ZREM", setKey, unpack(deleted, from, to))
        end
    end
    return {deleted, deletedCount}
end
local result
if ARGV[4] == "active" then
  result = cleanList(KEYS[1], ARGV[1], rangeStart, rangeEnd, ARGV[2], false --[[ hasFinished ]],
                      repeatKey)
elseif ARGV[4] == "delayed" then
  rangeEnd = "+inf"
  result = cleanSet(KEYS[1], ARGV[1], rangeEnd, ARGV[2], limit,
                    {"processedOn", "timestamp"}, false  --[[ hasFinished ]], repeatKey)
elseif ARGV[4] == "prioritized" then
  rangeEnd = "+inf"
  result = cleanSet(KEYS[1], ARGV[1], rangeEnd, ARGV[2], limit,
                    {"timestamp"}, false  --[[ hasFinished ]], repeatKey)
elseif ARGV[4] == "wait" or ARGV[4] == "paused" then
  result = cleanList(KEYS[1], ARGV[1], rangeStart, rangeEnd, ARGV[2], true --[[ hasFinished ]],
                      repeatKey)
else
  rangeEnd = ARGV[2]
  -- No need to pass repeat key as in that moment job won't be related to a job scheduler
  result = cleanSet(KEYS[1], ARGV[1], rangeEnd, ARGV[2], limit,
                    {"finishedOn"}, true  --[[ hasFinished ]])
end
rcall("XADD", KEYS[2], "*", "event", "cleaned", "count", result[2])
return result[1]
`;t.cleanJobsInSet={name:"cleanJobsInSet",content:r,keys:3}},73248:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.drain=void 0;let r=`--[[
  Drains the queue, removes all jobs that are waiting
  or delayed, but not active, completed or failed
  Input:
    KEYS[1] 'wait',
    KEYS[2] 'paused'
    KEYS[3] 'delayed'
    KEYS[4] 'prioritized'
    KEYS[5] 'jobschedulers' (repeat)
    ARGV[1]  queue key prefix
    ARGV[2]  should clean delayed jobs
]]
local rcall = redis.call
local queueBaseKey = ARGV[1]
--[[
  Functions to remove jobs.
]]
-- Includes
--[[
  Function to filter out jobs to ignore from a table.
]]
local function filterOutJobsToIgnore(jobs, jobsToIgnore)
  local filteredJobs = {}
  for i = 1, #jobs do
    if not jobsToIgnore[jobs[i]] then
      table.insert(filteredJobs, jobs[i])
    end
  end
  return filteredJobs
end
--[[
  Functions to remove jobs.
]]
-- Includes
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobKey, jobId)
  local deduplicationId = rcall("HGET", jobKey, "deid")
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      return rcall("DEL", deduplicationKey)
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobKey, jobId)
  end
  removeJobKeys(jobKey)
end
local function removeJobs(keys, hard, baseKey, max)
  for i, key in ipairs(keys) do
    removeJob(key, hard, baseKey, true --[[remove debounce key]])
  end
  return max - #keys
end
local function getListItems(keyName, max)
  return rcall('LRANGE', keyName, 0, max - 1)
end
local function removeListJobs(keyName, hard, baseKey, max, jobsToIgnore)
  local jobs = getListItems(keyName, max)
  if jobsToIgnore then
    jobs = filterOutJobsToIgnore(jobs, jobsToIgnore)
  end
  local count = removeJobs(jobs, hard, baseKey, max)
  rcall("LTRIM", keyName, #jobs, -1)
  return count
end
-- Includes
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
--[[
  Function to get ZSet items.
]]
local function getZSetItems(keyName, max)
  return rcall('ZRANGE', keyName, 0, max - 1)
end
local function removeZSetJobs(keyName, hard, baseKey, max, jobsToIgnore)
  local jobs = getZSetItems(keyName, max)
  if jobsToIgnore then
    jobs = filterOutJobsToIgnore(jobs, jobsToIgnore)
  end
  local count = removeJobs(jobs, hard, baseKey, max)
  if(#jobs > 0) then
    for from, to in batches(#jobs, 7000) do
      rcall("ZREM", keyName, unpack(jobs, from, to))
    end
  end
  return count
end
-- We must not remove delayed jobs if they are associated to a job scheduler.
local scheduledJobs = {}
local jobSchedulers = rcall("ZRANGE", KEYS[5], 0, -1, "WITHSCORES")
-- For every job scheduler, get the current delayed job id.
for i = 1, #jobSchedulers, 2 do
    local jobSchedulerId = jobSchedulers[i]
    local jobSchedulerMillis = jobSchedulers[i + 1]
    local delayedJobId = "repeat:" .. jobSchedulerId .. ":" .. jobSchedulerMillis
    scheduledJobs[delayedJobId] = true
end
removeListJobs(KEYS[1], true, queueBaseKey, 0, scheduledJobs) -- wait
removeListJobs(KEYS[2], true, queueBaseKey, 0, scheduledJobs) -- paused
if ARGV[2] == "1" then
  removeZSetJobs(KEYS[3], true, queueBaseKey, 0, scheduledJobs) -- delayed
end
removeZSetJobs(KEYS[4], true, queueBaseKey, 0, scheduledJobs) -- prioritized
`;t.drain={name:"drain",content:r,keys:5}},29166:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.extendLock=void 0;let r=`--[[
  Extend lock and removes the job from the stalled set.
  Input:
    KEYS[1] 'lock',
    KEYS[2] 'stalled'
    ARGV[1]  token
    ARGV[2]  lock duration in milliseconds
    ARGV[3]  jobid
  Output:
    "1" if lock extented succesfully.
]]
local rcall = redis.call
if rcall("GET", KEYS[1]) == ARGV[1] then
  --   if rcall("SET", KEYS[1], ARGV[1], "PX", ARGV[2], "XX") then
  if rcall("SET", KEYS[1], ARGV[1], "PX", ARGV[2]) then
    rcall("SREM", KEYS[2], ARGV[3])
    return 1
  end
end
return 0
`;t.extendLock={name:"extendLock",content:r,keys:2}},10082:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.extendLocks=void 0;let r=`--[[
  Extend locks for multiple jobs and remove them from the stalled set if successful.
  Return the list of job IDs for which the operation failed.
  KEYS[1] = stalledKey
  ARGV[1] = baseKey
  ARGV[2] = tokens
  ARGV[3] = jobIds
  ARGV[4] = lockDuration (ms)
  Output:
    An array of failed job IDs. If empty, all succeeded.
]]
local rcall = redis.call
local stalledKey = KEYS[1]
local baseKey = ARGV[1]
local tokens = cmsgpack.unpack(ARGV[2])
local jobIds = cmsgpack.unpack(ARGV[3])
local lockDuration = ARGV[4]
local jobCount = #jobIds
local failedJobs = {}
for i = 1, jobCount, 1 do
    local lockKey = baseKey .. jobIds[i] .. ':lock'
    local jobId = jobIds[i]
    local token = tokens[i]
    local currentToken = rcall("GET", lockKey)
    if currentToken == token then
        local setResult = rcall("SET", lockKey, token, "PX", lockDuration)
        if setResult then
            rcall("SREM", stalledKey, jobId)
        else
            table.insert(failedJobs, jobId)
        end
    else
        table.insert(failedJobs, jobId)
    end
end
return failedJobs
`;t.extendLocks={name:"extendLocks",content:r,keys:1}},23464:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getCounts=void 0;let r=`--[[
  Get counts per provided states
    Input:
      KEYS[1]    'prefix'
      ARGV[1...] types
]]
local rcall = redis.call;
local prefix = KEYS[1]
local results = {}
for i = 1, #ARGV do
  local stateKey = prefix .. ARGV[i]
  if ARGV[i] == "wait" or ARGV[i] == "paused" then
    -- Markers in waitlist DEPRECATED in v5: Remove in v6.
    local marker = rcall("LINDEX", stateKey, -1)
    if marker and string.sub(marker, 1, 2) == "0:" then
      local count = rcall("LLEN", stateKey)
      if count > 1 then
        rcall("RPOP", stateKey)
        results[#results+1] = count-1
      else
        results[#results+1] = 0
      end
    else
      results[#results+1] = rcall("LLEN", stateKey)
    end
  elseif ARGV[i] == "active" then
    results[#results+1] = rcall("LLEN", stateKey)
  else
    results[#results+1] = rcall("ZCARD", stateKey)
  end
end
return results
`;t.getCounts={name:"getCounts",content:r,keys:1}},70417:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getCountsPerPriority=void 0;let r=`--[[
  Get counts per provided states
    Input:
      KEYS[1] wait key
      KEYS[2] paused key
      KEYS[3] meta key
      KEYS[4] prioritized key
      ARGV[1...] priorities
]]
local rcall = redis.call
local results = {}
local waitKey = KEYS[1]
local pausedKey = KEYS[2]
local prioritizedKey = KEYS[4]
-- Includes
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePaused(queueMetaKey)
  return rcall("HEXISTS", queueMetaKey, "paused") == 1
end
for i = 1, #ARGV do
  local priority = tonumber(ARGV[i])
  if priority == 0 then
    if isQueuePaused(KEYS[3]) then
      results[#results+1] = rcall("LLEN", pausedKey)
    else
      results[#results+1] = rcall("LLEN", waitKey)
    end
  else
    results[#results+1] = rcall("ZCOUNT", prioritizedKey,
      priority * 0x100000000, (priority + 1)  * 0x100000000 - 1)
  end
end
return results
`;t.getCountsPerPriority={name:"getCountsPerPriority",content:r,keys:4}},1414:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getDependencyCounts=void 0;let r=`--[[
  Get counts per child states
    Input:
      KEYS[1]    processed key
      KEYS[2]    unprocessed key
      KEYS[3]    ignored key
      KEYS[4]    failed key
      ARGV[1...] types
]]
local rcall = redis.call;
local processedKey = KEYS[1]
local unprocessedKey = KEYS[2]
local ignoredKey = KEYS[3]
local failedKey = KEYS[4]
local results = {}
for i = 1, #ARGV do
  if ARGV[i] == "processed" then
    results[#results+1] = rcall("HLEN", processedKey)
  elseif ARGV[i] == "unprocessed" then
    results[#results+1] = rcall("SCARD", unprocessedKey)
  elseif ARGV[i] == "ignored" then
    results[#results+1] = rcall("HLEN", ignoredKey)
  else
    results[#results+1] = rcall("ZCARD", failedKey)
  end
end
return results
`;t.getDependencyCounts={name:"getDependencyCounts",content:r,keys:4}},89616:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getJobScheduler=void 0;let r=`--[[
  Get job scheduler record.
  Input:
    KEYS[1] 'repeat' key
    ARGV[1] id
]]
local rcall = redis.call
local jobSchedulerKey = KEYS[1] .. ":" .. ARGV[1]
local score = rcall("ZSCORE", KEYS[1], ARGV[1])
if score then
  return {rcall("HGETALL", jobSchedulerKey), score} -- get job data
end
return {nil, nil}
`;t.getJobScheduler={name:"getJobScheduler",content:r,keys:1}},398:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getMetrics=void 0;let r=`--[[
  Get metrics
  Input:
    KEYS[1] 'metrics' key
    KEYS[2] 'metrics data' key
    ARGV[1] start index
    ARGV[2] end index
]]
local rcall = redis.call;
local metricsKey = KEYS[1]
local dataKey = KEYS[2]
local metrics = rcall("HMGET", metricsKey, "count", "prevTS", "prevCount")
local data = rcall("LRANGE", dataKey, tonumber(ARGV[1]), tonumber(ARGV[2]))
local numPoints = rcall("LLEN", dataKey)
return {metrics, data, numPoints}
`;t.getMetrics={name:"getMetrics",content:r,keys:2}},22065:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getRanges=void 0;let r=`--[[
  Get job ids per provided states
    Input:
      KEYS[1]    'prefix'
      ARGV[1]    start
      ARGV[2]    end
      ARGV[3]    asc
      ARGV[4...] types
]]
local rcall = redis.call
local prefix = KEYS[1]
local rangeStart = tonumber(ARGV[1])
local rangeEnd = tonumber(ARGV[2])
local asc = ARGV[3]
local results = {}
local function getRangeInList(listKey, asc, rangeStart, rangeEnd, results)
  if asc == "1" then
    local modifiedRangeStart
    local modifiedRangeEnd
    if rangeStart == -1 then
      modifiedRangeStart = 0
    else
      modifiedRangeStart = -(rangeStart + 1)
    end
    if rangeEnd == -1 then
      modifiedRangeEnd = 0
    else
      modifiedRangeEnd = -(rangeEnd + 1)
    end
    results[#results+1] = rcall("LRANGE", listKey,
      modifiedRangeEnd,
      modifiedRangeStart)
  else
    results[#results+1] = rcall("LRANGE", listKey, rangeStart, rangeEnd)
  end
end
for i = 4, #ARGV do
  local stateKey = prefix .. ARGV[i]
  if ARGV[i] == "wait" or ARGV[i] == "paused" then
    -- Markers in waitlist DEPRECATED in v5: Remove in v6.
    local marker = rcall("LINDEX", stateKey, -1)
    if marker and string.sub(marker, 1, 2) == "0:" then
      local count = rcall("LLEN", stateKey)
      if count > 1 then
        rcall("RPOP", stateKey)
        getRangeInList(stateKey, asc, rangeStart, rangeEnd, results)
      else
        results[#results+1] = {}
      end
    else
      getRangeInList(stateKey, asc, rangeStart, rangeEnd, results)
    end
  elseif ARGV[i] == "active" then
    getRangeInList(stateKey, asc, rangeStart, rangeEnd, results)
  else
    if asc == "1" then
      results[#results+1] = rcall("ZRANGE", stateKey, rangeStart, rangeEnd)
    else
      results[#results+1] = rcall("ZREVRANGE", stateKey, rangeStart, rangeEnd)
    end
  end
end
return results
`;t.getRanges={name:"getRanges",content:r,keys:1}},37982:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getRateLimitTtl=void 0;let r=`--[[
  Get rate limit ttl
    Input:
      KEYS[1] 'limiter'
      KEYS[2] 'meta'
      ARGV[1] maxJobs
]]
local rcall = redis.call
-- Includes
--[[
  Function to get current rate limit ttl.
]]
local function getRateLimitTTL(maxJobs, rateLimiterKey)
  if maxJobs and maxJobs <= tonumber(rcall("GET", rateLimiterKey) or 0) then
    local pttl = rcall("PTTL", rateLimiterKey)
    if pttl == 0 then
      rcall("DEL", rateLimiterKey)
    end
    if pttl > 0 then
      return pttl
    end
  end
  return 0
end
local rateLimiterKey = KEYS[1]
if ARGV[1] ~= "0" then
  return getRateLimitTTL(tonumber(ARGV[1]), rateLimiterKey)
else
  local rateLimitMax = rcall("HGET", KEYS[2], "max")
  if rateLimitMax then
    return getRateLimitTTL(tonumber(rateLimitMax), rateLimiterKey)
  end
  return rcall("PTTL", rateLimiterKey)
end
`;t.getRateLimitTtl={name:"getRateLimitTtl",content:r,keys:2}},67261:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getState=void 0;let r=`--[[
  Get a job state
  Input: 
    KEYS[1] 'completed' key,
    KEYS[2] 'failed' key
    KEYS[3] 'delayed' key
    KEYS[4] 'active' key
    KEYS[5] 'wait' key
    KEYS[6] 'paused' key
    KEYS[7] 'waiting-children' key
    KEYS[8] 'prioritized' key
    ARGV[1] job id
  Output:
    'completed'
    'failed'
    'delayed'
    'active'
    'prioritized'
    'waiting'
    'waiting-children'
    'unknown'
]]
local rcall = redis.call
if rcall("ZSCORE", KEYS[1], ARGV[1]) then
  return "completed"
end
if rcall("ZSCORE", KEYS[2], ARGV[1]) then
  return "failed"
end
if rcall("ZSCORE", KEYS[3], ARGV[1]) then
  return "delayed"
end
if rcall("ZSCORE", KEYS[8], ARGV[1]) then
  return "prioritized"
end
-- Includes
--[[
  Functions to check if a item belongs to a list.
]]
local function checkItemInList(list, item)
  for _, v in pairs(list) do
    if v == item then
      return 1
    end
  end
  return nil
end
local active_items = rcall("LRANGE", KEYS[4] , 0, -1)
if checkItemInList(active_items, ARGV[1]) ~= nil then
  return "active"
end
local wait_items = rcall("LRANGE", KEYS[5] , 0, -1)
if checkItemInList(wait_items, ARGV[1]) ~= nil then
  return "waiting"
end
local paused_items = rcall("LRANGE", KEYS[6] , 0, -1)
if checkItemInList(paused_items, ARGV[1]) ~= nil then
  return "waiting"
end
if rcall("ZSCORE", KEYS[7], ARGV[1]) then
  return "waiting-children"
end
return "unknown"
`;t.getState={name:"getState",content:r,keys:8}},6433:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getStateV2=void 0;let r=`--[[
  Get a job state
  Input: 
    KEYS[1] 'completed' key,
    KEYS[2] 'failed' key
    KEYS[3] 'delayed' key
    KEYS[4] 'active' key
    KEYS[5] 'wait' key
    KEYS[6] 'paused' key
    KEYS[7] 'waiting-children' key
    KEYS[8] 'prioritized' key
    ARGV[1] job id
  Output:
    'completed'
    'failed'
    'delayed'
    'active'
    'waiting'
    'waiting-children'
    'unknown'
]]
local rcall = redis.call
if rcall("ZSCORE", KEYS[1], ARGV[1]) then
  return "completed"
end
if rcall("ZSCORE", KEYS[2], ARGV[1]) then
  return "failed"
end
if rcall("ZSCORE", KEYS[3], ARGV[1]) then
  return "delayed"
end
if rcall("ZSCORE", KEYS[8], ARGV[1]) then
  return "prioritized"
end
if rcall("LPOS", KEYS[4] , ARGV[1]) then
  return "active"
end
if rcall("LPOS", KEYS[5] , ARGV[1]) then
  return "waiting"
end
if rcall("LPOS", KEYS[6] , ARGV[1]) then
  return "waiting"
end
if rcall("ZSCORE", KEYS[7] , ARGV[1]) then
  return "waiting-children"
end
return "unknown"
`;t.getStateV2={name:"getStateV2",content:r,keys:8}},61114:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(87175);n.__exportStar(r(3805),t),n.__exportStar(r(81819),t),n.__exportStar(r(23864),t),n.__exportStar(r(32401),t),n.__exportStar(r(78045),t),n.__exportStar(r(86182),t),n.__exportStar(r(53411),t),n.__exportStar(r(79431),t),n.__exportStar(r(3424),t),n.__exportStar(r(9837),t),n.__exportStar(r(73248),t),n.__exportStar(r(29166),t),n.__exportStar(r(10082),t),n.__exportStar(r(23464),t),n.__exportStar(r(70417),t),n.__exportStar(r(1414),t),n.__exportStar(r(89616),t),n.__exportStar(r(398),t),n.__exportStar(r(22065),t),n.__exportStar(r(37982),t),n.__exportStar(r(67261),t),n.__exportStar(r(6433),t),n.__exportStar(r(35122),t),n.__exportStar(r(93902),t),n.__exportStar(r(88060),t),n.__exportStar(r(40108),t),n.__exportStar(r(78255),t),n.__exportStar(r(49722),t),n.__exportStar(r(44706),t),n.__exportStar(r(94105),t),n.__exportStar(r(40908),t),n.__exportStar(r(46137),t),n.__exportStar(r(51340),t),n.__exportStar(r(87558),t),n.__exportStar(r(23e3),t),n.__exportStar(r(12488),t),n.__exportStar(r(86455),t),n.__exportStar(r(40860),t),n.__exportStar(r(30352),t),n.__exportStar(r(8501),t),n.__exportStar(r(45366),t),n.__exportStar(r(37529),t),n.__exportStar(r(69688),t),n.__exportStar(r(88463),t),n.__exportStar(r(17252),t),n.__exportStar(r(67705),t),n.__exportStar(r(78960),t),n.__exportStar(r(54966),t),n.__exportStar(r(68531),t)},35122:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.isFinished=void 0;let r=`--[[
  Checks if a job is finished (.i.e. is in the completed or failed set)
  Input: 
    KEYS[1] completed key
    KEYS[2] failed key
    KEYS[3] job key
    ARGV[1] job id
    ARGV[2] return value?
  Output:
    0 - Not finished.
    1 - Completed.
    2 - Failed.
   -1 - Missing job. 
]]
local rcall = redis.call
if rcall("EXISTS", KEYS[3]) ~= 1 then
  if ARGV[2] == "1" then
    return {-1,"Missing key for job " .. KEYS[3] .. ". isFinished"}
  end  
  return -1
end
if rcall("ZSCORE", KEYS[1], ARGV[1]) then
  if ARGV[2] == "1" then
    local returnValue = rcall("HGET", KEYS[3], "returnvalue")
    return {1,returnValue}
  end
  return 1
end
if rcall("ZSCORE", KEYS[2], ARGV[1]) then
  if ARGV[2] == "1" then
    local failedReason = rcall("HGET", KEYS[3], "failedReason")
    return {2,failedReason}
  end
  return 2
end
if ARGV[2] == "1" then
  return {0}
end
return 0
`;t.isFinished={name:"isFinished",content:r,keys:3}},93902:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.isJobInList=void 0;let r=`--[[
  Checks if job is in a given list.
  Input:
    KEYS[1]
    ARGV[1]
  Output:
    1 if element found in the list.
]]
-- Includes
--[[
  Functions to check if a item belongs to a list.
]]
local function checkItemInList(list, item)
  for _, v in pairs(list) do
    if v == item then
      return 1
    end
  end
  return nil
end
local items = redis.call("LRANGE", KEYS[1] , 0, -1)
return checkItemInList(items, ARGV[1])
`;t.isJobInList={name:"isJobInList",content:r,keys:1}},88060:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.isMaxed=void 0;let r=`--[[
  Checks if queue is maxed.
  Input:
    KEYS[1] meta key
    KEYS[2] active key
  Output:
    1 if element found in the list.
]]
local rcall = redis.call
-- Includes
--[[
  Function to check if queue is maxed or not.
]]
local function isQueueMaxed(queueMetaKey, activeKey)
  local maxConcurrency = rcall("HGET", queueMetaKey, "concurrency")
  if maxConcurrency then
    local activeCount = rcall("LLEN", activeKey)
    if activeCount >= tonumber(maxConcurrency) then
      return true
    end
  end
  return false
end
return isQueueMaxed(KEYS[1], KEYS[2])
`;t.isMaxed={name:"isMaxed",content:r,keys:2}},40108:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.moveJobFromActiveToWait=void 0;let r=`--[[
  Function to move job from active state to wait.
  Input:
    KEYS[1]  active key
    KEYS[2]  wait key
    KEYS[3]  stalled key
    KEYS[4]  paused key
    KEYS[5]  meta key
    KEYS[6]  limiter key
    KEYS[7]  prioritized key
    KEYS[8]  marker key
    KEYS[9]  event key
    ARGV[1] job id
    ARGV[2] lock token
    ARGV[3] job id key
]]
local rcall = redis.call
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to push back job considering priority in front of same prioritized jobs.
]]
local function pushBackJobWithPriority(prioritizedKey, priority, jobId)
  -- in order to put it at front of same prioritized jobs
  -- we consider prioritized counter as 0
  local score = priority * 0x100000000
  rcall("ZADD", prioritizedKey, score, jobId)
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function removeLock(jobKey, stalledKey, token, jobId)
  if token ~= "0" then
    local lockKey = jobKey .. ':lock'
    local lockToken = rcall("GET", lockKey)
    if lockToken == token then
      rcall("DEL", lockKey)
      rcall("SREM", stalledKey, jobId)
    else
      if lockToken then
        -- Lock exists but token does not match
        return -6
      else
        -- Lock is missing completely
        return -2
      end
    end
  end
  return 0
end
local jobId = ARGV[1]
local token = ARGV[2]
local jobKey = ARGV[3]
if rcall("EXISTS", jobKey) == 0 then
  return -1
end
local errorCode = removeLock(jobKey, KEYS[3], token, jobId)
if errorCode < 0 then
  return errorCode
end
local metaKey = KEYS[5]
local removed = rcall("LREM", KEYS[1], 1, jobId)
if removed > 0 then
  local target, isPausedOrMaxed = getTargetQueueList(metaKey, KEYS[1], KEYS[2], KEYS[4])
  local priority = tonumber(rcall("HGET", ARGV[3], "priority")) or 0
  if priority > 0 then
    pushBackJobWithPriority(KEYS[7], priority, jobId)
  else
    addJobInTargetList(target, KEYS[8], "RPUSH", isPausedOrMaxed, jobId)
  end
  local maxEvents = getOrSetMaxEvents(metaKey)
  -- Emit waiting event
  rcall("XADD", KEYS[9], "MAXLEN", "~", maxEvents, "*", "event", "waiting",
    "jobId", jobId, "prev", "active")
end
local pttl = rcall("PTTL", KEYS[6])
if pttl > 0 then
  return pttl
else
  return 0
end
`;t.moveJobFromActiveToWait={name:"moveJobFromActiveToWait",content:r,keys:9}},78255:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.moveJobsToWait=void 0;let r=`--[[
  Move completed, failed or delayed jobs to wait.
  Note: Does not support jobs with priorities.
  Input:
    KEYS[1] base key
    KEYS[2] events stream
    KEYS[3] state key (failed, completed, delayed)
    KEYS[4] 'wait'
    KEYS[5] 'paused'
    KEYS[6] 'meta'
    KEYS[7] 'active'
    KEYS[8] 'marker'
    ARGV[1] count
    ARGV[2] timestamp
    ARGV[3] prev state
  Output:
    1  means the operation is not completed
    0  means the operation is completed
]]
local maxCount = tonumber(ARGV[1])
local timestamp = tonumber(ARGV[2])
local rcall = redis.call;
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local metaKey = KEYS[6]
local target, isPausedOrMaxed = getTargetQueueList(metaKey, KEYS[7], KEYS[4], KEYS[5])
local jobs = rcall('ZRANGEBYSCORE', KEYS[3], 0, timestamp, 'LIMIT', 0, maxCount)
if (#jobs > 0) then
    if ARGV[3] == "failed" then
        for i, key in ipairs(jobs) do
            local jobKey = KEYS[1] .. key
            rcall("HDEL", jobKey, "finishedOn", "processedOn", "failedReason")
        end
    elseif ARGV[3] == "completed" then
        for i, key in ipairs(jobs) do
            local jobKey = KEYS[1] .. key
            rcall("HDEL", jobKey, "finishedOn", "processedOn", "returnvalue")
        end
    end
    local maxEvents = getOrSetMaxEvents(metaKey)
    for i, key in ipairs(jobs) do
        -- Emit waiting event
        rcall("XADD", KEYS[2], "MAXLEN", "~", maxEvents, "*", "event",
              "waiting", "jobId", key, "prev", ARGV[3]);
    end
    for from, to in batches(#jobs, 7000) do
        rcall("ZREM", KEYS[3], unpack(jobs, from, to))
        rcall("LPUSH", target, unpack(jobs, from, to))
    end
    addBaseMarkerIfNeeded(KEYS[8], isPausedOrMaxed)
end
maxCount = maxCount - #jobs
if (maxCount <= 0) then return 1 end
return 0
`;t.moveJobsToWait={name:"moveJobsToWait",content:r,keys:8}},49722:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.moveStalledJobsToWait=void 0;let r=`--[[
  Move stalled jobs to wait.
    Input:
      KEYS[1] 'stalled' (SET)
      KEYS[2] 'wait',   (LIST)
      KEYS[3] 'active', (LIST)
      KEYS[4] 'stalled-check', (KEY)
      KEYS[5] 'meta', (KEY)
      KEYS[6] 'paused', (LIST)
      KEYS[7] 'marker'
      KEYS[8] 'event stream' (STREAM)
      ARGV[1]  Max stalled job count
      ARGV[2]  queue.toKey('')
      ARGV[3]  timestamp
      ARGV[4]  max check time
    Events:
      'stalled' with stalled job id.
]]
local rcall = redis.call
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
--[[
  Function to move job to wait to be picked up by a waiting worker.
]]
-- Includes
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function moveJobToWait(metaKey, activeKey, waitKey, pausedKey, markerKey, eventStreamKey,
  jobId, pushCmd)
  local target, isPausedOrMaxed = getTargetQueueList(metaKey, activeKey, waitKey, pausedKey)
  addJobInTargetList(target, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall("XADD", eventStreamKey, "*", "event", "waiting", "jobId", jobId, 'prev', 'active')
end
--[[
  Function to trim events, default 10000.
]]
-- Includes
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
local function trimEvents(metaKey, eventStreamKey)
  local maxEvents = getOrSetMaxEvents(metaKey)
  if maxEvents then
    rcall("XTRIM", eventStreamKey, "MAXLEN", "~", maxEvents)
  else
    rcall("XTRIM", eventStreamKey, "MAXLEN", "~", 10000)
  end
end
local stalledKey = KEYS[1]
local waitKey = KEYS[2]
local activeKey = KEYS[3]
local stalledCheckKey = KEYS[4]
local metaKey = KEYS[5]
local pausedKey = KEYS[6]
local markerKey = KEYS[7]
local eventStreamKey = KEYS[8]
local maxStalledJobCount = tonumber(ARGV[1])
local queueKeyPrefix = ARGV[2]
local timestamp = ARGV[3]
local maxCheckTime = ARGV[4]
if rcall("EXISTS", stalledCheckKey) == 1 then
    return {}
end
rcall("SET", stalledCheckKey, timestamp, "PX", maxCheckTime)
-- Trim events before emiting them to avoid trimming events emitted in this script
trimEvents(metaKey, eventStreamKey)
-- Move all stalled jobs to wait
local stalling = rcall('SMEMBERS', stalledKey)
local stalled = {}
if (#stalling > 0) then
    rcall('DEL', stalledKey)
    -- Remove from active list
    for i, jobId in ipairs(stalling) do
        -- Markers in waitlist DEPRECATED in v5: Remove in v6.
        if string.sub(jobId, 1, 2) == "0:" then
            -- If the jobId is a delay marker ID we just remove it.
            rcall("LREM", activeKey, 1, jobId)
        else
            local jobKey = queueKeyPrefix .. jobId
            -- Check that the lock is also missing, then we can handle this job as really stalled.
            if (rcall("EXISTS", jobKey .. ":lock") == 0) then
                --  Remove from the active queue.
                local removed = rcall("LREM", activeKey, 1, jobId)
                if (removed > 0) then
                    -- If this job has been stalled too many times, such as if it crashes the worker, then fail it.
                    local stalledCount = rcall("HINCRBY", jobKey, "stc", 1)
                    -- Check if this is a repeatable job by looking at job options
                    local jobOpts = rcall("HGET", jobKey, "opts")
                    local isRepeatableJob = false
                    if jobOpts then
                        local opts = cjson.decode(jobOpts)
                        if opts and opts["repeat"] then
                            isRepeatableJob = true
                        end
                    end
                    -- Only fail job if it exceeds stall limit AND is not a repeatable job
                    if stalledCount > maxStalledJobCount and not isRepeatableJob then
                        local failedReason = "job stalled more than allowable limit"
                        rcall("HSET", jobKey, "defa", failedReason)
                    end
                    moveJobToWait(metaKey, activeKey, waitKey, pausedKey, markerKey, eventStreamKey, jobId,
                        "RPUSH")
                    -- Emit the stalled event
                    rcall("XADD", eventStreamKey, "*", "event", "stalled", "jobId", jobId)
                    table.insert(stalled, jobId)
                end
            end
        end
    end
end
-- Mark potentially stalled jobs
local active = rcall('LRANGE', activeKey, 0, -1)
if (#active > 0) then
    for from, to in batches(#active, 7000) do
        rcall('SADD', stalledKey, unpack(active, from, to))
    end
end
return stalled
`;t.moveStalledJobsToWait={name:"moveStalledJobsToWait",content:r,keys:8}},44706:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.moveToActive=void 0;let r=`--[[
  Move next job to be processed to active, lock it and fetch its data. The job
  may be delayed, in that case we need to move it to the delayed set instead.
  This operation guarantees that the worker owns the job during the lock
  expiration time. The worker is responsible of keeping the lock fresh
  so that no other worker picks this job again.
  Input:
    KEYS[1] wait key
    KEYS[2] active key
    KEYS[3] prioritized key
    KEYS[4] stream events key
    KEYS[5] stalled key
    -- Rate limiting
    KEYS[6] rate limiter key
    KEYS[7] delayed key
    -- Delayed jobs
    KEYS[8] paused key
    KEYS[9] meta key
    KEYS[10] pc priority counter
    -- Marker
    KEYS[11] marker key
    -- Arguments
    ARGV[1] key prefix
    ARGV[2] timestamp
    ARGV[3] opts
    opts - token - lock token
    opts - lockDuration
    opts - limiter
    opts - name - worker name
]]
local rcall = redis.call
local waitKey = KEYS[1]
local activeKey = KEYS[2]
local eventStreamKey = KEYS[4]
local rateLimiterKey = KEYS[6]
local delayedKey = KEYS[7]
local opts = cmsgpack.unpack(ARGV[3])
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
--[[
  Function to get current rate limit ttl.
]]
local function getRateLimitTTL(maxJobs, rateLimiterKey)
  if maxJobs and maxJobs <= tonumber(rcall("GET", rateLimiterKey) or 0) then
    local pttl = rcall("PTTL", rateLimiterKey)
    if pttl == 0 then
      rcall("DEL", rateLimiterKey)
    end
    if pttl > 0 then
      return pttl
    end
  end
  return 0
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to move job from prioritized state to active.
]]
local function moveJobFromPrioritizedToActive(priorityKey, activeKey, priorityCounterKey)
  local prioritizedJob = rcall("ZPOPMIN", priorityKey)
  if #prioritizedJob > 0 then
    rcall("LPUSH", activeKey, prioritizedJob[1])
    return prioritizedJob[1]
  else
    rcall("DEL", priorityCounterKey)
  end
end
--[[
  Function to move job from wait state to active.
  Input:
    opts - token - lock token
    opts - lockDuration
    opts - limiter
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function prepareJobForProcessing(keyPrefix, rateLimiterKey, eventStreamKey,
    jobId, processedOn, maxJobs, limiterDuration, markerKey, opts)
  local jobKey = keyPrefix .. jobId
  -- Check if we need to perform rate limiting.
  if maxJobs then
    local jobCounter = tonumber(rcall("INCR", rateLimiterKey))
    if jobCounter == 1 then
      local integerDuration = math.floor(math.abs(limiterDuration))
      rcall("PEXPIRE", rateLimiterKey, integerDuration)
    end
  end
  -- get a lock
  if opts['token'] ~= "0" then
    local lockKey = jobKey .. ':lock'
    rcall("SET", lockKey, opts['token'], "PX", opts['lockDuration'])
  end
  local optionalValues = {}
  if opts['name'] then
    -- Set "processedBy" field to the worker name
    table.insert(optionalValues, "pb")
    table.insert(optionalValues, opts['name'])
  end
  rcall("XADD", eventStreamKey, "*", "event", "active", "jobId", jobId, "prev", "waiting")
  rcall("HMSET", jobKey, "processedOn", processedOn, unpack(optionalValues))
  rcall("HINCRBY", jobKey, "ats", 1)
  addBaseMarkerIfNeeded(markerKey, false)
  -- rate limit delay must be 0 in this case to prevent adding more delay
  -- when job that is moved to active needs to be processed
  return {rcall("HGETALL", jobKey), jobId, 0, 0} -- get job data
end
--[[
  Updates the delay set, by moving delayed jobs that should
  be processed now to "wait".
     Events:
      'waiting'
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
-- Try to get as much as 1000 jobs at once
local function promoteDelayedJobs(delayedKey, markerKey, targetKey, prioritizedKey,
                                  eventStreamKey, prefix, timestamp, priorityCounterKey, isPaused)
    local jobs = rcall("ZRANGEBYSCORE", delayedKey, 0, (timestamp + 1) * 0x1000 - 1, "LIMIT", 0, 1000)
    if (#jobs > 0) then
        rcall("ZREM", delayedKey, unpack(jobs))
        for _, jobId in ipairs(jobs) do
            local jobKey = prefix .. jobId
            local priority =
                tonumber(rcall("HGET", jobKey, "priority")) or 0
            if priority == 0 then
                -- LIFO or FIFO
                rcall("LPUSH", targetKey, jobId)
            else
                local score = getPriorityScore(priority, priorityCounterKey)
                rcall("ZADD", prioritizedKey, score, jobId)
            end
            -- Emit waiting event
            rcall("XADD", eventStreamKey, "*", "event", "waiting", "jobId",
                  jobId, "prev", "delayed")
            rcall("HSET", jobKey, "delay", 0)
        end
        addBaseMarkerIfNeeded(markerKey, isPaused)
    end
end
local target, isPausedOrMaxed, rateLimitMax, rateLimitDuration = getTargetQueueList(KEYS[9],
    activeKey, waitKey, KEYS[8])
-- Check if there are delayed jobs that we can move to wait.
local markerKey = KEYS[11]
promoteDelayedJobs(delayedKey, markerKey, target, KEYS[3], eventStreamKey, ARGV[1],
                   ARGV[2], KEYS[10], isPausedOrMaxed)
local maxJobs = tonumber(rateLimitMax or (opts['limiter'] and opts['limiter']['max']))
local expireTime = getRateLimitTTL(maxJobs, rateLimiterKey)
-- Check if we are rate limited first.
if expireTime > 0 then return {0, 0, expireTime, 0} end
-- paused or maxed queue
if isPausedOrMaxed then return {0, 0, 0, 0} end
local limiterDuration = (opts['limiter'] and opts['limiter']['duration']) or rateLimitDuration
-- no job ID, try non-blocking move from wait to active
local jobId = rcall("RPOPLPUSH", waitKey, activeKey)
-- Markers in waitlist DEPRECATED in v5: Will be completely removed in v6.
if jobId and string.sub(jobId, 1, 2) == "0:" then
    rcall("LREM", activeKey, 1, jobId)
    jobId = rcall("RPOPLPUSH", waitKey, activeKey)
end
if jobId then
    return prepareJobForProcessing(ARGV[1], rateLimiterKey, eventStreamKey, jobId, ARGV[2],
                                   maxJobs, limiterDuration, markerKey, opts)
else
    jobId = moveJobFromPrioritizedToActive(KEYS[3], activeKey, KEYS[10])
    if jobId then
        return prepareJobForProcessing(ARGV[1], rateLimiterKey, eventStreamKey, jobId, ARGV[2],
                                       maxJobs, limiterDuration, markerKey, opts)
    end
end
-- Return the timestamp for the next delayed job if any.
local nextTimestamp = getNextDelayedTimestamp(delayedKey)
if nextTimestamp ~= nil then return {0, 0, 0, nextTimestamp} end
return {0, 0, 0, 0}
`;t.moveToActive={name:"moveToActive",content:r,keys:11}},94105:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.moveToDelayed=void 0;let r=`--[[
  Moves job from active to delayed set.
  Input:
    KEYS[1] marker key
    KEYS[2] active key
    KEYS[3] prioritized key
    KEYS[4] delayed key
    KEYS[5] job key
    KEYS[6] events stream
    KEYS[7] meta key
    KEYS[8] stalled key
    ARGV[1] key prefix
    ARGV[2] timestamp
    ARGV[3] the id of the job
    ARGV[4] queue token
    ARGV[5] delay value
    ARGV[6] skip attempt
    ARGV[7] optional job fields to update
  Output:
    0 - OK
   -1 - Missing job.
   -3 - Job not in active set.
  Events:
    - delayed key.
]]
local rcall = redis.call
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Bake in the job id first 12 bits into the timestamp
  to guarantee correct execution order of delayed jobs
  (up to 4096 jobs per given timestamp or 4096 jobs apart per timestamp)
  WARNING: Jobs that are so far apart that they wrap around will cause FIFO to fail
]]
local function getDelayedScore(delayedKey, timestamp, delay)
  local delayedTimestamp = (delay > 0 and (tonumber(timestamp) + delay)) or tonumber(timestamp)
  local minScore = delayedTimestamp * 0x1000
  local maxScore = (delayedTimestamp + 1 ) * 0x1000 - 1
  local result = rcall("ZREVRANGEBYSCORE", delayedKey, maxScore,
    minScore, "WITHSCORES","LIMIT", 0, 1)
  if #result then
    local currentMaxScore = tonumber(result[2])
    if currentMaxScore ~= nil then
      if currentMaxScore >= maxScore then
        return maxScore, delayedTimestamp
      else
        return currentMaxScore + 1, delayedTimestamp
      end
    end
  end
  return minScore, delayedTimestamp
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
local function removeLock(jobKey, stalledKey, token, jobId)
  if token ~= "0" then
    local lockKey = jobKey .. ':lock'
    local lockToken = rcall("GET", lockKey)
    if lockToken == token then
      rcall("DEL", lockKey)
      rcall("SREM", stalledKey, jobId)
    else
      if lockToken then
        -- Lock exists but token does not match
        return -6
      else
        -- Lock is missing completely
        return -2
      end
    end
  end
  return 0
end
--[[
  Function to update a bunch of fields in a job.
]]
local function updateJobFields(jobKey, msgpackedFields)
  if msgpackedFields and #msgpackedFields > 0 then
    local fieldsToUpdate = cmsgpack.unpack(msgpackedFields)
    if fieldsToUpdate then
      rcall("HMSET", jobKey, unpack(fieldsToUpdate))
    end
  end
end
local jobKey = KEYS[5]
local metaKey = KEYS[7]
local token = ARGV[4] 
if rcall("EXISTS", jobKey) == 1 then
    local errorCode = removeLock(jobKey, KEYS[8], token, ARGV[3])
    if errorCode < 0 then
        return errorCode
    end
    updateJobFields(jobKey, ARGV[7])
    local delayedKey = KEYS[4]
    local jobId = ARGV[3]
    local delay = tonumber(ARGV[5])
    local numRemovedElements = rcall("LREM", KEYS[2], -1, jobId)
    if numRemovedElements < 1 then return -3 end
    local score, delayedTimestamp = getDelayedScore(delayedKey, ARGV[2], delay)
    if ARGV[6] == "0" then
        rcall("HINCRBY", jobKey, "atm", 1)
    end
    rcall("HSET", jobKey, "delay", ARGV[5])
    local maxEvents = getOrSetMaxEvents(metaKey)
    rcall("ZADD", delayedKey, score, jobId)
    rcall("XADD", KEYS[6], "MAXLEN", "~", maxEvents, "*", "event", "delayed",
          "jobId", jobId, "delay", delayedTimestamp)
    -- Check if we need to push a marker job to wake up sleeping workers.
    local markerKey = KEYS[1]
    addDelayMarkerIfNeeded(markerKey, delayedKey)
    return 0
else
    return -1
end
`;t.moveToDelayed={name:"moveToDelayed",content:r,keys:8}},40908:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.moveToFinished=void 0;let r=`--[[
  Move job from active to a finished status (completed o failed)
  A job can only be moved to completed if it was active.
  The job must be locked before it can be moved to a finished status,
  and the lock must be released in this script.
    Input:
      KEYS[1] wait key
      KEYS[2] active key
      KEYS[3] prioritized key
      KEYS[4] event stream key
      KEYS[5] stalled key
      -- Rate limiting
      KEYS[6] rate limiter key
      KEYS[7] delayed key
      KEYS[8] paused key
      KEYS[9] meta key
      KEYS[10] pc priority counter
      KEYS[11] completed/failed key
      KEYS[12] jobId key
      KEYS[13] metrics key
      KEYS[14] marker key
      ARGV[1]  jobId
      ARGV[2]  timestamp
      ARGV[3]  msg property returnvalue / failedReason
      ARGV[4]  return value / failed reason
      ARGV[5]  target (completed/failed)
      ARGV[6]  fetch next?
      ARGV[7]  keys prefix
      ARGV[8]  opts
      ARGV[9]  job fields to update
      opts - token - lock token
      opts - keepJobs
      opts - lockDuration - lock duration in milliseconds
      opts - attempts max attempts
      opts - maxMetricsSize
      opts - fpof - fail parent on fail
      opts - cpof - continue parent on fail
      opts - idof - ignore dependency on fail
      opts - rdof - remove dependency on fail
      opts - name - worker name
    Output:
      0 OK
      -1 Missing key.
      -2 Missing lock.
      -3 Job not in active set
      -4 Job has pending children
      -6 Lock is not owned by this client
      -9 Job has failed children
    Events:
      'completed/failed'
]]
local rcall = redis.call
--- Includes
--[[
  Functions to collect metrics based on a current and previous count of jobs.
  Granualarity is fixed at 1 minute.
]]
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
local function collectMetrics(metaKey, dataPointsList, maxDataPoints,
                                 timestamp)
    -- Increment current count
    local count = rcall("HINCRBY", metaKey, "count", 1) - 1
    -- Compute how many data points we need to add to the list, N.
    local prevTS = rcall("HGET", metaKey, "prevTS")
    if not prevTS then
        -- If prevTS is nil, set it to the current timestamp
        rcall("HSET", metaKey, "prevTS", timestamp, "prevCount", 0)
        return
    end
    local N = math.min(math.floor(timestamp / 60000) - math.floor(prevTS / 60000), tonumber(maxDataPoints))
    if N > 0 then
        local delta = count - rcall("HGET", metaKey, "prevCount")
        -- If N > 1, add N-1 zeros to the list
        if N > 1 then
            local points = {}
            points[1] = delta
            for i = 2, N do
                points[i] = 0
            end
            for from, to in batches(#points, 7000) do
                rcall("LPUSH", dataPointsList, unpack(points, from, to))
            end
        else
            -- LPUSH delta to the list
            rcall("LPUSH", dataPointsList, delta)
        end
        -- LTRIM to keep list to its max size
        rcall("LTRIM", dataPointsList, 0, maxDataPoints - 1)
        -- update prev count with current count
        rcall("HSET", metaKey, "prevCount", count, "prevTS", timestamp)
    end
end
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
--[[
  Function to get current rate limit ttl.
]]
local function getRateLimitTTL(maxJobs, rateLimiterKey)
  if maxJobs and maxJobs <= tonumber(rcall("GET", rateLimiterKey) or 0) then
    local pttl = rcall("PTTL", rateLimiterKey)
    if pttl == 0 then
      rcall("DEL", rateLimiterKey)
    end
    if pttl > 0 then
      return pttl
    end
  end
  return 0
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to move job from prioritized state to active.
]]
local function moveJobFromPrioritizedToActive(priorityKey, activeKey, priorityCounterKey)
  local prioritizedJob = rcall("ZPOPMIN", priorityKey)
  if #prioritizedJob > 0 then
    rcall("LPUSH", activeKey, prioritizedJob[1])
    return prioritizedJob[1]
  else
    rcall("DEL", priorityCounterKey)
  end
end
--[[
  Function to recursively move from waitingChildren to failed.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized)
  if no pending dependencies.
]]
-- Includes
--[[
  Validate and move parent to a wait status (waiting, delayed or prioritized) if needed.
]]
-- Includes
--[[
  Move parent to a wait status (wait, prioritized or delayed)
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
local function moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    local parentWaitKey = parentQueueKey .. ":wait"
    local parentPausedKey = parentQueueKey .. ":paused"
    local parentActiveKey = parentQueueKey .. ":active"
    local parentMetaKey = parentQueueKey .. ":meta"
    local parentMarkerKey = parentQueueKey .. ":marker"
    local jobAttributes = rcall("HMGET", parentKey, "priority", "delay")
    local priority = tonumber(jobAttributes[1]) or 0
    local delay = tonumber(jobAttributes[2]) or 0
    if delay > 0 then
        local delayedTimestamp = tonumber(timestamp) + delay
        local score = delayedTimestamp * 0x1000
        local parentDelayedKey = parentQueueKey .. ":delayed"
        rcall("ZADD", parentDelayedKey, score, parentId)
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "delayed", "jobId", parentId, "delay",
            delayedTimestamp)
        addDelayMarkerIfNeeded(parentMarkerKey, parentDelayedKey)
    else
        if priority == 0 then
            local parentTarget, isParentPausedOrMaxed = getTargetQueueList(parentMetaKey, parentActiveKey,
                parentWaitKey, parentPausedKey)
            addJobInTargetList(parentTarget, parentMarkerKey, "RPUSH", isParentPausedOrMaxed, parentId)
        else
            local isPausedOrMaxed = isQueuePausedOrMaxed(parentMetaKey, parentActiveKey)
            addJobWithPriority(parentMarkerKey, parentQueueKey .. ":prioritized", priority, parentId,
                parentQueueKey .. ":pc", isPausedOrMaxed)
        end
        rcall("XADD", parentQueueKey .. ":events", "*", "event", "waiting", "jobId", parentId, "prev",
            "waiting-children")
    end
end
local function moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then    
      rcall("ZREM", parentWaitingChildrenKey, parentId)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    end
  end
end
local function moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey,
  parentId, timestamp)
  local doNotHavePendingDependencies = rcall("SCARD", parentDependenciesKey) == 0
  if doNotHavePendingDependencies then
    moveParentToWaitIfNeeded(parentQueueKey, parentKey, parentId, timestamp)
  end
end
--[[
  Functions to remove jobs when removeOnFail option is provided.
]]
-- Includes
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobKey, jobId)
  local deduplicationId = rcall("HGET", jobKey, "deid")
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      return rcall("DEL", deduplicationKey)
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobKey, jobId)
  end
  removeJobKeys(jobKey)
end
--[[
  Functions to remove jobs by max age.
]]
-- Includes
local function removeJobsByMaxAge(timestamp, maxAge, targetSet, prefix,
  shouldRemoveDebounceKey)
  local start = timestamp - maxAge * 1000
  local jobIds = rcall("ZREVRANGEBYSCORE", targetSet, start, "-inf")
  for i, jobId in ipairs(jobIds) do
    removeJob(jobId, false, prefix, false --[[remove debounce key]])
  end
  rcall("ZREMRANGEBYSCORE", targetSet, "-inf", start)
end
--[[
  Functions to remove jobs by max count.
]]
-- Includes
local function removeJobsByMaxCount(maxCount, targetSet, prefix)
  local start = maxCount
  local jobIds = rcall("ZREVRANGE", targetSet, start, -1)
  for i, jobId in ipairs(jobIds) do
    removeJob(jobId, false, prefix, false --[[remove debounce key]])
  end
  rcall("ZREMRANGEBYRANK", targetSet, 0, -(maxCount + 1))
end
local function removeJobsOnFail(queueKeyPrefix, failedKey, jobId, opts, timestamp)
  local removeOnFailType = type(opts["removeOnFail"])
  if removeOnFailType == "number" then
    removeJobsByMaxCount(opts["removeOnFail"],
                        failedKey, queueKeyPrefix)
  elseif removeOnFailType == "boolean" then
    if opts["removeOnFail"] then
      removeJob(jobId, false, queueKeyPrefix,
                false --[[remove debounce key]])
      rcall("ZREM", failedKey, jobId)
    end
  elseif removeOnFailType ~= "nil" then
    local maxAge = opts["removeOnFail"]["age"]
    local maxCount = opts["removeOnFail"]["count"]
    if maxAge ~= nil then
      removeJobsByMaxAge(timestamp, maxAge,
                        failedKey, queueKeyPrefix)
    end
    if maxCount ~= nil and maxCount > 0 then
      removeJobsByMaxCount(maxCount, failedKey,
                            queueKeyPrefix)
    end
  end 
end
local moveParentToFailedIfNeeded = function (parentQueueKey, parentKey, parentId, jobIdKey, timestamp)
  if rcall("EXISTS", parentKey) == 1 then
    local parentWaitingChildrenKey = parentQueueKey .. ":waiting-children"
    local parentDelayedKey = parentQueueKey .. ":delayed"
    local parentPrioritizedKey = parentQueueKey .. ":prioritized"
    local parentWaitingChildrenOrDelayedKey
    local prevState
    if rcall("ZSCORE", parentWaitingChildrenKey, parentId) then
      parentWaitingChildrenOrDelayedKey = parentWaitingChildrenKey
      prevState = "waiting-children"
    elseif rcall("ZSCORE", parentDelayedKey, parentId) then
      parentWaitingChildrenOrDelayedKey = parentDelayedKey
      prevState = "delayed"
      rcall("HSET", parentKey, "delay", 0)
    end
    if parentWaitingChildrenOrDelayedKey then
      rcall("ZREM", parentWaitingChildrenOrDelayedKey, parentId)
      local parentQueuePrefix = parentQueueKey .. ":"
      local parentFailedKey = parentQueueKey .. ":failed"
      local deferredFailure = "child " .. jobIdKey .. " failed"
      rcall("HSET", parentKey, "defa", deferredFailure)
      moveParentToWait(parentQueueKey, parentKey, parentId, timestamp)
    else
      if not rcall("ZSCORE", parentQueueKey .. ":failed", parentId) then
        local deferredFailure = "child " .. jobIdKey .. " failed"
        rcall("HSET", parentKey, "defa", deferredFailure)
      end
    end
  end
end
local moveChildFromDependenciesIfNeeded = function (rawParentData, childKey, failedReason, timestamp)
  if rawParentData then
    local parentData = cjson.decode(rawParentData)
    local parentKey = parentData['queueKey'] .. ':' .. parentData['id']
    local parentDependenciesChildrenKey = parentKey .. ":dependencies"
    if parentData['fpof'] then
      if rcall("SREM", parentDependenciesChildrenKey, childKey) == 1 then
        local parentUnsuccesssfulChildrenKey = parentKey .. ":unsuccessful"
        rcall("ZADD", parentUnsuccesssfulChildrenKey, timestamp, childKey)
        moveParentToFailedIfNeeded(
          parentData['queueKey'],
          parentKey,
          parentData['id'],
          childKey,
          timestamp
        )
      end
    elseif parentData['cpof'] then
      if rcall("SREM", parentDependenciesChildrenKey, childKey) == 1 then
        local parentFailedChildrenKey = parentKey .. ":failed"
        rcall("HSET", parentFailedChildrenKey, childKey, failedReason)
        moveParentToWaitIfNeeded(parentData['queueKey'], parentKey, parentData['id'], timestamp)
      end
    elseif parentData['idof'] or parentData['rdof'] then
      if rcall("SREM", parentDependenciesChildrenKey, childKey) == 1 then
        moveParentToWaitIfNoPendingDependencies(parentData['queueKey'], parentDependenciesChildrenKey,
          parentKey, parentData['id'], timestamp)
        if parentData['idof'] then
          local parentFailedChildrenKey = parentKey .. ":failed"
          rcall("HSET", parentFailedChildrenKey, childKey, failedReason)
        end
      end
    end
  end
end
--[[
  Function to move job from wait state to active.
  Input:
    opts - token - lock token
    opts - lockDuration
    opts - limiter
]]
-- Includes
local function prepareJobForProcessing(keyPrefix, rateLimiterKey, eventStreamKey,
    jobId, processedOn, maxJobs, limiterDuration, markerKey, opts)
  local jobKey = keyPrefix .. jobId
  -- Check if we need to perform rate limiting.
  if maxJobs then
    local jobCounter = tonumber(rcall("INCR", rateLimiterKey))
    if jobCounter == 1 then
      local integerDuration = math.floor(math.abs(limiterDuration))
      rcall("PEXPIRE", rateLimiterKey, integerDuration)
    end
  end
  -- get a lock
  if opts['token'] ~= "0" then
    local lockKey = jobKey .. ':lock'
    rcall("SET", lockKey, opts['token'], "PX", opts['lockDuration'])
  end
  local optionalValues = {}
  if opts['name'] then
    -- Set "processedBy" field to the worker name
    table.insert(optionalValues, "pb")
    table.insert(optionalValues, opts['name'])
  end
  rcall("XADD", eventStreamKey, "*", "event", "active", "jobId", jobId, "prev", "waiting")
  rcall("HMSET", jobKey, "processedOn", processedOn, unpack(optionalValues))
  rcall("HINCRBY", jobKey, "ats", 1)
  addBaseMarkerIfNeeded(markerKey, false)
  -- rate limit delay must be 0 in this case to prevent adding more delay
  -- when job that is moved to active needs to be processed
  return {rcall("HGETALL", jobKey), jobId, 0, 0} -- get job data
end
--[[
  Updates the delay set, by moving delayed jobs that should
  be processed now to "wait".
     Events:
      'waiting'
]]
-- Includes
-- Try to get as much as 1000 jobs at once
local function promoteDelayedJobs(delayedKey, markerKey, targetKey, prioritizedKey,
                                  eventStreamKey, prefix, timestamp, priorityCounterKey, isPaused)
    local jobs = rcall("ZRANGEBYSCORE", delayedKey, 0, (timestamp + 1) * 0x1000 - 1, "LIMIT", 0, 1000)
    if (#jobs > 0) then
        rcall("ZREM", delayedKey, unpack(jobs))
        for _, jobId in ipairs(jobs) do
            local jobKey = prefix .. jobId
            local priority =
                tonumber(rcall("HGET", jobKey, "priority")) or 0
            if priority == 0 then
                -- LIFO or FIFO
                rcall("LPUSH", targetKey, jobId)
            else
                local score = getPriorityScore(priority, priorityCounterKey)
                rcall("ZADD", prioritizedKey, score, jobId)
            end
            -- Emit waiting event
            rcall("XADD", eventStreamKey, "*", "event", "waiting", "jobId",
                  jobId, "prev", "delayed")
            rcall("HSET", jobKey, "delay", 0)
        end
        addBaseMarkerIfNeeded(markerKey, isPaused)
    end
end
--[[
  Function to remove deduplication key if needed
  when a job is moved to completed or failed states.
]]
local function removeDeduplicationKeyIfNeededOnFinalization(prefixKey,
  deduplicationId, jobId)
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local pttl = rcall("PTTL", deduplicationKey)
    if pttl == 0 then
      return rcall("DEL", deduplicationKey)
    end
    if pttl == -1 then
      local currentJobId = rcall('GET', deduplicationKey)
      if currentJobId and currentJobId == jobId then
        return rcall("DEL", deduplicationKey)
      end
    end
  end
end
local function removeLock(jobKey, stalledKey, token, jobId)
  if token ~= "0" then
    local lockKey = jobKey .. ':lock'
    local lockToken = rcall("GET", lockKey)
    if lockToken == token then
      rcall("DEL", lockKey)
      rcall("SREM", stalledKey, jobId)
    else
      if lockToken then
        -- Lock exists but token does not match
        return -6
      else
        -- Lock is missing completely
        return -2
      end
    end
  end
  return 0
end
--[[
  Function to trim events, default 10000.
]]
-- Includes
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
local function trimEvents(metaKey, eventStreamKey)
  local maxEvents = getOrSetMaxEvents(metaKey)
  if maxEvents then
    rcall("XTRIM", eventStreamKey, "MAXLEN", "~", maxEvents)
  else
    rcall("XTRIM", eventStreamKey, "MAXLEN", "~", 10000)
  end
end
--[[
  Validate and move or add dependencies to parent.
]]
-- Includes
local function updateParentDepsIfNeeded(parentKey, parentQueueKey, parentDependenciesKey,
  parentId, jobIdKey, returnvalue, timestamp )
  local processedSet = parentKey .. ":processed"
  rcall("HSET", processedSet, jobIdKey, returnvalue)
  moveParentToWaitIfNoPendingDependencies(parentQueueKey, parentDependenciesKey, parentKey, parentId, timestamp)
end
--[[
  Function to update a bunch of fields in a job.
]]
local function updateJobFields(jobKey, msgpackedFields)
  if msgpackedFields and #msgpackedFields > 0 then
    local fieldsToUpdate = cmsgpack.unpack(msgpackedFields)
    if fieldsToUpdate then
      rcall("HMSET", jobKey, unpack(fieldsToUpdate))
    end
  end
end
local jobIdKey = KEYS[12]
if rcall("EXISTS", jobIdKey) == 1 then -- Make sure job exists
    -- Make sure it does not have pending dependencies
    -- It must happen before removing lock
    if ARGV[5] == "completed" then
        if rcall("SCARD", jobIdKey .. ":dependencies") ~= 0 then
            return -4
        end
        if rcall("ZCARD", jobIdKey .. ":unsuccessful") ~= 0 then
            return -9
        end
    end
    local opts = cmsgpack.unpack(ARGV[8])
    local token = opts['token']
    local errorCode = removeLock(jobIdKey, KEYS[5], token, ARGV[1])
    if errorCode < 0 then
        return errorCode
    end
    updateJobFields(jobIdKey, ARGV[9]);
    local attempts = opts['attempts']
    local maxMetricsSize = opts['maxMetricsSize']
    local maxCount = opts['keepJobs']['count']
    local maxAge = opts['keepJobs']['age']
    local jobAttributes = rcall("HMGET", jobIdKey, "parentKey", "parent", "deid")
    local parentKey = jobAttributes[1] or ""
    local parentId = ""
    local parentQueueKey = ""
    if jobAttributes[2] then -- TODO: need to revisit this logic if it's still needed
        local jsonDecodedParent = cjson.decode(jobAttributes[2])
        parentId = jsonDecodedParent['id']
        parentQueueKey = jsonDecodedParent['queueKey']
    end
    local jobId = ARGV[1]
    local timestamp = ARGV[2]
    -- Remove from active list (if not active we shall return error)
    local numRemovedElements = rcall("LREM", KEYS[2], -1, jobId)
    if (numRemovedElements < 1) then
        return -3
    end
    local eventStreamKey = KEYS[4]
    local metaKey = KEYS[9]
    -- Trim events before emiting them to avoid trimming events emitted in this script
    trimEvents(metaKey, eventStreamKey)
    local prefix = ARGV[7]
    removeDeduplicationKeyIfNeededOnFinalization(prefix, jobAttributes[3], jobId)
    -- If job has a parent we need to
    -- 1) remove this job id from parents dependencies
    -- 2) move the job Id to parent "processed" set
    -- 3) push the results into parent "results" list
    -- 4) if parent's dependencies is empty, then move parent to "wait/paused". Note it may be a different queue!.
    if parentId == "" and parentKey ~= "" then
        parentId = getJobIdFromKey(parentKey)
        parentQueueKey = getJobKeyPrefix(parentKey, ":" .. parentId)
    end
    if parentId ~= "" then
        if ARGV[5] == "completed" then
            local dependenciesSet = parentKey .. ":dependencies"
            if rcall("SREM", dependenciesSet, jobIdKey) == 1 then
                updateParentDepsIfNeeded(parentKey, parentQueueKey, dependenciesSet, parentId, jobIdKey, ARGV[4],
                    timestamp)
            end
        else
            moveChildFromDependenciesIfNeeded(jobAttributes[2], jobIdKey, ARGV[4], timestamp)
        end
    end
    local attemptsMade = rcall("HINCRBY", jobIdKey, "atm", 1)
    -- Remove job?
    if maxCount ~= 0 then
        local targetSet = KEYS[11]
        -- Add to complete/failed set
        rcall("ZADD", targetSet, timestamp, jobId)
        rcall("HSET", jobIdKey, ARGV[3], ARGV[4], "finishedOn", timestamp)
        -- "returnvalue" / "failedReason" and "finishedOn"
        if ARGV[5] == "failed" then
            rcall("HDEL", jobIdKey, "defa")
        end
        -- Remove old jobs?
        if maxAge ~= nil then
            removeJobsByMaxAge(timestamp, maxAge, targetSet, prefix)
        end
        if maxCount ~= nil and maxCount > 0 then
            removeJobsByMaxCount(maxCount, targetSet, prefix)
        end
    else
        removeJobKeys(jobIdKey)
        if parentKey ~= "" then
            -- TODO: when a child is removed when finished, result or failure in parent
            -- must not be deleted, those value references should be deleted when the parent
            -- is deleted
            removeParentDependencyKey(jobIdKey, false, parentKey, jobAttributes[3])
        end
    end
    rcall("XADD", eventStreamKey, "*", "event", ARGV[5], "jobId", jobId, ARGV[3], ARGV[4], "prev", "active")
    if ARGV[5] == "failed" then
        if tonumber(attemptsMade) >= tonumber(attempts) then
            rcall("XADD", eventStreamKey, "*", "event", "retries-exhausted", "jobId", jobId, "attemptsMade",
                attemptsMade)
        end
    end
    -- Collect metrics
    if maxMetricsSize ~= "" then
        collectMetrics(KEYS[13], KEYS[13] .. ':data', maxMetricsSize, timestamp)
    end
    -- Try to get next job to avoid an extra roundtrip if the queue is not closing,
    -- and not rate limited.
    if (ARGV[6] == "1") then
        local target, isPausedOrMaxed, rateLimitMax, rateLimitDuration = getTargetQueueList(metaKey, KEYS[2],
            KEYS[1], KEYS[8])
        local markerKey = KEYS[14]
        -- Check if there are delayed jobs that can be promoted
        promoteDelayedJobs(KEYS[7], markerKey, target, KEYS[3], eventStreamKey, prefix, timestamp, KEYS[10],
            isPausedOrMaxed)
        local maxJobs = tonumber(rateLimitMax or (opts['limiter'] and opts['limiter']['max']))
        -- Check if we are rate limited first.
        local expireTime = getRateLimitTTL(maxJobs, KEYS[6])
        if expireTime > 0 then
            return {0, 0, expireTime, 0}
        end
        -- paused or maxed queue
        if isPausedOrMaxed then
            return {0, 0, 0, 0}
        end
        local limiterDuration = (opts['limiter'] and opts['limiter']['duration']) or rateLimitDuration
        jobId = rcall("RPOPLPUSH", KEYS[1], KEYS[2])
        if jobId then
            -- Markers in waitlist DEPRECATED in v5: Remove in v6.
            if string.sub(jobId, 1, 2) == "0:" then
                rcall("LREM", KEYS[2], 1, jobId)
                -- If jobId is special ID 0:delay (delay greater than 0), then there is no job to process
                -- but if ID is 0:0, then there is at least 1 prioritized job to process
                if jobId == "0:0" then
                    jobId = moveJobFromPrioritizedToActive(KEYS[3], KEYS[2], KEYS[10])
                    return prepareJobForProcessing(prefix, KEYS[6], eventStreamKey, jobId, timestamp, maxJobs,
                        limiterDuration, markerKey, opts)
                end
            else
                return prepareJobForProcessing(prefix, KEYS[6], eventStreamKey, jobId, timestamp, maxJobs,
                    limiterDuration, markerKey, opts)
            end
        else
            jobId = moveJobFromPrioritizedToActive(KEYS[3], KEYS[2], KEYS[10])
            if jobId then
                return prepareJobForProcessing(prefix, KEYS[6], eventStreamKey, jobId, timestamp, maxJobs,
                    limiterDuration, markerKey, opts)
            end
        end
        -- Return the timestamp for the next delayed job if any.
        local nextTimestamp = getNextDelayedTimestamp(KEYS[7])
        if nextTimestamp ~= nil then
            -- The result is guaranteed to be positive, since the
            -- ZRANGEBYSCORE command would have return a job otherwise.
            return {0, 0, 0, nextTimestamp}
        end
    end
    local waitLen = rcall("LLEN", KEYS[1])
    if waitLen == 0 then
        local activeLen = rcall("LLEN", KEYS[2])
        if activeLen == 0 then
            local prioritizedLen = rcall("ZCARD", KEYS[3])
            if prioritizedLen == 0 then
                rcall("XADD", eventStreamKey, "*", "event", "drained")
            end
        end
    end
    return 0
else
    return -1
end
`;t.moveToFinished={name:"moveToFinished",content:r,keys:14}},46137:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.moveToWaitingChildren=void 0;let r=`--[[
  Moves job from active to waiting children set.
  Input:
    KEYS[1] active key
    KEYS[2] wait-children key
    KEYS[3] job key
    KEYS[4] job dependencies key
    KEYS[5] job unsuccessful key
    KEYS[6] stalled key
    KEYS[7] events key
    ARGV[1] token
    ARGV[2] child key
    ARGV[3] timestamp
    ARGV[4] jobId
    ARGV[5] prefix
  Output:
    0 - OK
    1 - There are not pending dependencies.
   -1 - Missing job.
   -2 - Missing lock
   -3 - Job not in active set
   -9 - Job has failed children
]]
local rcall = redis.call
local activeKey = KEYS[1]
local waitingChildrenKey = KEYS[2]
local jobKey = KEYS[3]
local jobDependenciesKey = KEYS[4]
local jobUnsuccessfulKey = KEYS[5]
local stalledKey = KEYS[6]
local eventStreamKey = KEYS[7]
local token = ARGV[1]
local timestamp = ARGV[3]
local jobId = ARGV[4]
--- Includes
local function removeLock(jobKey, stalledKey, token, jobId)
  if token ~= "0" then
    local lockKey = jobKey .. ':lock'
    local lockToken = rcall("GET", lockKey)
    if lockToken == token then
      rcall("DEL", lockKey)
      rcall("SREM", stalledKey, jobId)
    else
      if lockToken then
        -- Lock exists but token does not match
        return -6
      else
        -- Lock is missing completely
        return -2
      end
    end
  end
  return 0
end
local function removeJobFromActive(activeKey, stalledKey, jobKey, jobId,
    token)
  local errorCode = removeLock(jobKey, stalledKey, token, jobId)
  if errorCode < 0 then
    return errorCode
  end
  local numRemovedElements = rcall("LREM", activeKey, -1, jobId)
  if numRemovedElements < 1 then
    return -3
  end
  return 0
end
local function moveToWaitingChildren(activeKey, waitingChildrenKey, stalledKey, eventStreamKey,
    jobKey, jobId, timestamp, token)
  local errorCode = removeJobFromActive(activeKey, stalledKey, jobKey, jobId, token)
  if errorCode < 0 then
    return errorCode
  end
  local score = tonumber(timestamp)
  rcall("ZADD", waitingChildrenKey, score, jobId)
  rcall("XADD", eventStreamKey, "*", "event", "waiting-children", "jobId", jobId, 'prev', 'active')
  return 0
end
if rcall("EXISTS", jobKey) == 1 then
  if rcall("ZCARD", jobUnsuccessfulKey) ~= 0 then
    return -9
  else
    if ARGV[2] ~= "" then
      if rcall("SISMEMBER", jobDependenciesKey, ARGV[2]) ~= 0 then
        return moveToWaitingChildren(activeKey, waitingChildrenKey, stalledKey, eventStreamKey,
          jobKey, jobId, timestamp, token)
      end
      return 1
    else
      if rcall("SCARD", jobDependenciesKey) ~= 0 then 
        return moveToWaitingChildren(activeKey, waitingChildrenKey, stalledKey, eventStreamKey,
          jobKey, jobId, timestamp, token)
      end
      return 1
    end    
  end
end
return -1
`;t.moveToWaitingChildren={name:"moveToWaitingChildren",content:r,keys:7}},51340:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.obliterate=void 0;let r=`--[[
  Completely obliterates a queue and all of its contents
  This command completely destroys a queue including all of its jobs, current or past 
  leaving no trace of its existence. Since this script needs to iterate to find all the job
  keys, consider that this call may be slow for very large queues.
  The queue needs to be "paused" or it will return an error
  If the queue has currently active jobs then the script by default will return error,
  however this behaviour can be overrided using the 'force' option.
  Input:
    KEYS[1] meta
    KEYS[2] base
    ARGV[1] count
    ARGV[2] force
]]
local maxCount = tonumber(ARGV[1])
local baseKey = KEYS[2]
local rcall = redis.call
-- Includes
--[[
  Functions to remove jobs.
]]
-- Includes
--[[
  Function to remove job.
]]
-- Includes
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobKey, jobId)
  local deduplicationId = rcall("HGET", jobKey, "deid")
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      return rcall("DEL", deduplicationKey)
    end
  end
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local function removeJob(jobId, hard, baseKey, shouldRemoveDeduplicationKey)
  local jobKey = baseKey .. jobId
  removeParentDependencyKey(jobKey, hard, nil, baseKey)
  if shouldRemoveDeduplicationKey then
    removeDeduplicationKeyIfNeededOnRemoval(baseKey, jobKey, jobId)
  end
  removeJobKeys(jobKey)
end
local function removeJobs(keys, hard, baseKey, max)
  for i, key in ipairs(keys) do
    removeJob(key, hard, baseKey, true --[[remove debounce key]])
  end
  return max - #keys
end
--[[
  Functions to remove jobs.
]]
-- Includes
--[[
  Function to filter out jobs to ignore from a table.
]]
local function filterOutJobsToIgnore(jobs, jobsToIgnore)
  local filteredJobs = {}
  for i = 1, #jobs do
    if not jobsToIgnore[jobs[i]] then
      table.insert(filteredJobs, jobs[i])
    end
  end
  return filteredJobs
end
local function getListItems(keyName, max)
  return rcall('LRANGE', keyName, 0, max - 1)
end
local function removeListJobs(keyName, hard, baseKey, max, jobsToIgnore)
  local jobs = getListItems(keyName, max)
  if jobsToIgnore then
    jobs = filterOutJobsToIgnore(jobs, jobsToIgnore)
  end
  local count = removeJobs(jobs, hard, baseKey, max)
  rcall("LTRIM", keyName, #jobs, -1)
  return count
end
-- Includes
--[[
  Function to loop in batches.
  Just a bit of warning, some commands as ZREM
  could receive a maximum of 7000 parameters per call.
]]
local function batches(n, batchSize)
  local i = 0
  return function()
    local from = i * batchSize + 1
    i = i + 1
    if (from <= n) then
      local to = math.min(from + batchSize - 1, n)
      return from, to
    end
  end
end
--[[
  Function to get ZSet items.
]]
local function getZSetItems(keyName, max)
  return rcall('ZRANGE', keyName, 0, max - 1)
end
local function removeZSetJobs(keyName, hard, baseKey, max, jobsToIgnore)
  local jobs = getZSetItems(keyName, max)
  if jobsToIgnore then
    jobs = filterOutJobsToIgnore(jobs, jobsToIgnore)
  end
  local count = removeJobs(jobs, hard, baseKey, max)
  if(#jobs > 0) then
    for from, to in batches(#jobs, 7000) do
      rcall("ZREM", keyName, unpack(jobs, from, to))
    end
  end
  return count
end
local function removeLockKeys(keys)
  for i, key in ipairs(keys) do
    rcall("DEL", baseKey .. key .. ':lock')
  end
end
-- 1) Check if paused, if not return with error.
if rcall("HEXISTS", KEYS[1], "paused") ~= 1 then
  return -1 -- Error, NotPaused
end
-- 2) Check if there are active jobs, if there are and not "force" return error.
local activeKey = baseKey .. 'active'
local activeJobs = getListItems(activeKey, maxCount)
if (#activeJobs > 0) then
  if(ARGV[2] == "") then 
    return -2 -- Error, ExistActiveJobs
  end
end
removeLockKeys(activeJobs)
maxCount = removeJobs(activeJobs, true, baseKey, maxCount)
rcall("LTRIM", activeKey, #activeJobs, -1)
if(maxCount <= 0) then
  return 1
end
local delayedKey = baseKey .. 'delayed'
maxCount = removeZSetJobs(delayedKey, true, baseKey, maxCount)
if(maxCount <= 0) then
  return 1
end
local repeatKey = baseKey .. 'repeat'
local repeatJobsIds = getZSetItems(repeatKey, maxCount)
for i, key in ipairs(repeatJobsIds) do
  local jobKey = repeatKey .. ":" .. key
  rcall("DEL", jobKey)
end
if(#repeatJobsIds > 0) then
  for from, to in batches(#repeatJobsIds, 7000) do
    rcall("ZREM", repeatKey, unpack(repeatJobsIds, from, to))
  end
end
maxCount = maxCount - #repeatJobsIds
if(maxCount <= 0) then
  return 1
end
local completedKey = baseKey .. 'completed'
maxCount = removeZSetJobs(completedKey, true, baseKey, maxCount)
if(maxCount <= 0) then
  return 1
end
local waitKey = baseKey .. 'paused'
maxCount = removeListJobs(waitKey, true, baseKey, maxCount)
if(maxCount <= 0) then
  return 1
end
local prioritizedKey = baseKey .. 'prioritized'
maxCount = removeZSetJobs(prioritizedKey, true, baseKey, maxCount)
if(maxCount <= 0) then
  return 1
end
local failedKey = baseKey .. 'failed'
maxCount = removeZSetJobs(failedKey, true, baseKey, maxCount)
if(maxCount <= 0) then
  return 1
end
if(maxCount > 0) then
  rcall("DEL",
    baseKey .. 'events',
    baseKey .. 'delay', 
    baseKey .. 'stalled-check',
    baseKey .. 'stalled',
    baseKey .. 'id',
    baseKey .. 'pc',
    baseKey .. 'meta',
    baseKey .. 'metrics:completed',
    baseKey .. 'metrics:completed:data',
    baseKey .. 'metrics:failed',
    baseKey .. 'metrics:failed:data')
  return 0
else
  return 1
end
`;t.obliterate={name:"obliterate",content:r,keys:2}},87558:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.paginate=void 0;let r=`--[[
    Paginate a set or hash
    Input:
      KEYS[1] key pointing to the set or hash to be paginated.
      ARGV[1]  page start offset
      ARGV[2]  page end offset (-1 for all the elements)
      ARGV[3]  cursor
      ARGV[4]  offset
      ARGV[5]  max iterations
      ARGV[6]  fetch jobs?
    Output:
      [cursor, offset, items, numItems]
]]
local rcall = redis.call
-- Includes
--[[
  Function to achieve pagination for a set or hash.
  This function simulates pagination in the most efficient way possible
  for a set using sscan or hscan.
  The main limitation is that sets are not order preserving, so the
  pagination is not stable. This means that if the set is modified
  between pages, the same element may appear in different pages.
]] -- Maximum number of elements to be returned by sscan per iteration.
local maxCount = 100
-- Finds the cursor, and returns the first elements available for the requested page.
local function findPage(key, command, pageStart, pageSize, cursor, offset,
                        maxIterations, fetchJobs)
    local items = {}
    local jobs = {}
    local iterations = 0
    repeat
        -- Iterate over the set using sscan/hscan.
        local result = rcall(command, key, cursor, "COUNT", maxCount)
        cursor = result[1]
        local members = result[2]
        local step = 1
        if command == "HSCAN" then
            step = 2
        end
        if #members == 0 then
            -- If the result is empty, we can return the result.
            return cursor, offset, items, jobs
        end
        local chunkStart = offset
        local chunkEnd = offset + #members / step
        local pageEnd = pageStart + pageSize
        if chunkEnd < pageStart then
            -- If the chunk is before the page, we can skip it.
            offset = chunkEnd
        elseif chunkStart > pageEnd then
            -- If the chunk is after the page, we can return the result.
            return cursor, offset, items, jobs
        else
            -- If the chunk is overlapping the page, we need to add the elements to the result.
            for i = 1, #members, step do
                if offset >= pageEnd then
                    return cursor, offset, items, jobs
                end
                if offset >= pageStart then
                    local index = #items + 1
                    if fetchJobs ~= nil then
                        jobs[#jobs+1] = rcall("HGETALL", members[i])
                    end
                    if step == 2 then
                        items[index] = {members[i], members[i + 1]}
                    else
                        items[index] = members[i]
                    end
                end
                offset = offset + 1
            end
        end
        iterations = iterations + 1
    until cursor == "0" or iterations >= maxIterations
    return cursor, offset, items, jobs
end
local key = KEYS[1]
local scanCommand = "SSCAN"
local countCommand = "SCARD"
local type = rcall("TYPE", key)["ok"]
if type == "none" then
    return {0, 0, {}, 0}
elseif type == "hash" then
    scanCommand = "HSCAN"
    countCommand = "HLEN"
elseif type ~= "set" then
    return
        redis.error_reply("Pagination is only supported for sets and hashes.")
end
local numItems = rcall(countCommand, key)
local startOffset = tonumber(ARGV[1])
local endOffset = tonumber(ARGV[2])
if endOffset == -1 then 
  endOffset = numItems
end
local pageSize = (endOffset - startOffset) + 1
local cursor, offset, items, jobs = findPage(key, scanCommand, startOffset,
                                       pageSize, ARGV[3], tonumber(ARGV[4]),
                                       tonumber(ARGV[5]), ARGV[6])
return {cursor, offset, items, numItems, jobs}
`;t.paginate={name:"paginate",content:r,keys:1}},23e3:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.pause=void 0;let r=`--[[
  Pauses or resumes a queue globably.
  Input:
    KEYS[1] 'wait' or 'paused''
    KEYS[2] 'paused' or 'wait'
    KEYS[3] 'meta'
    KEYS[4] 'prioritized'
    KEYS[5] events stream key
    KEYS[6] 'delayed'
    KEYS|7] 'marker'
    ARGV[1] 'paused' or 'resumed'
  Event:
    publish paused or resumed event.
]]
local rcall = redis.call
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
local markerKey = KEYS[7]
local hasJobs = rcall("EXISTS", KEYS[1]) == 1
--TODO: check this logic to be reused when changing a delay
if hasJobs then rcall("RENAME", KEYS[1], KEYS[2]) end
if ARGV[1] == "paused" then
    rcall("HSET", KEYS[3], "paused", 1)
    rcall("DEL", markerKey)
else
    rcall("HDEL", KEYS[3], "paused")
    if hasJobs or rcall("ZCARD", KEYS[4]) > 0 then
        -- Add marker if there are waiting or priority jobs
        rcall("ZADD", markerKey, 0, "0")
    else
        addDelayMarkerIfNeeded(markerKey, KEYS[6])
    end
end
rcall("XADD", KEYS[5], "*", "event", ARGV[1]);
`;t.pause={name:"pause",content:r,keys:7}},12488:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.promote=void 0;let r=`--[[
  Promotes a job that is currently "delayed" to the "waiting" state
    Input:
      KEYS[1] 'delayed'
      KEYS[2] 'wait'
      KEYS[3] 'paused'
      KEYS[4] 'meta'
      KEYS[5] 'prioritized'
      KEYS[6] 'active'
      KEYS[7] 'pc' priority counter
      KEYS[8] 'event stream'
      KEYS[9] 'marker'
      ARGV[1]  queue.toKey('')
      ARGV[2]  jobId
    Output:
       0 - OK
      -3 - Job not in delayed zset.
    Events:
      'waiting'
]]
local rcall = redis.call
local jobId = ARGV[2]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
if rcall("ZREM", KEYS[1], jobId) == 1 then
    local jobKey = ARGV[1] .. jobId
    local priority = tonumber(rcall("HGET", jobKey, "priority")) or 0
    local metaKey = KEYS[4]
    local markerKey = KEYS[9]
    -- Remove delayed "marker" from the wait list if there is any.
    -- Since we are adding a job we do not need the marker anymore.
    -- Markers in waitlist DEPRECATED in v5: Remove in v6.
    local target, isPausedOrMaxed = getTargetQueueList(metaKey, KEYS[6], KEYS[2], KEYS[3])
    local marker = rcall("LINDEX", target, 0)
    if marker and string.sub(marker, 1, 2) == "0:" then rcall("LPOP", target) end
    if priority == 0 then
        -- LIFO or FIFO
        addJobInTargetList(target, markerKey, "LPUSH", isPausedOrMaxed, jobId)
    else
        addJobWithPriority(markerKey, KEYS[5], priority, jobId, KEYS[7], isPausedOrMaxed)
    end
    rcall("XADD", KEYS[8], "*", "event", "waiting", "jobId", jobId, "prev",
          "delayed");
    rcall("HSET", jobKey, "delay", 0)
    return 0
else
    return -3
end
`;t.promote={name:"promote",content:r,keys:9}},86455:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.releaseLock=void 0;let r=`--[[
  Release lock
    Input:
      KEYS[1] 'lock',
      ARGV[1]  token
      ARGV[2]  lock duration in milliseconds
    Output:
      "OK" if lock extented succesfully.
]]
local rcall = redis.call
if rcall("GET", KEYS[1]) == ARGV[1] then
  return rcall("DEL", KEYS[1])
else
  return 0
end
`;t.releaseLock={name:"releaseLock",content:r,keys:1}},40860:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeChildDependency=void 0;let r=`--[[
  Break parent-child dependency by removing
  child reference from parent
  Input:
    KEYS[1] 'key' prefix,
    ARGV[1] job key
    ARGV[2] parent key
    Output:
       0  - OK
       1  - There is not relationship.
      -1  - Missing job key
      -5  - Missing parent key
]]
local rcall = redis.call
local jobKey = ARGV[1]
local parentKey = ARGV[2]
-- Includes
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
if rcall("EXISTS", jobKey) ~= 1 then return -1 end
if rcall("EXISTS", parentKey) ~= 1 then return -5 end
if removeParentDependencyKey(jobKey, false, parentKey, KEYS[1], nil) then
  rcall("HDEL", jobKey, "parentKey", "parent")
  return 0
else
  return 1
end`;t.removeChildDependency={name:"removeChildDependency",content:r,keys:1}},30352:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeJob=void 0;let r=`--[[
    Remove a job from all the statuses it may be in as well as all its data.
    In order to be able to remove a job, it cannot be active.
    Input:
      KEYS[1] jobKey
      KEYS[2] repeat key
      ARGV[1] jobId
      ARGV[2] remove children
      ARGV[3] queue prefix
    Events:
      'removed'
]]
local rcall = redis.call
-- Includes
--[[
  Function to check if the job belongs to a job scheduler and
  current delayed job matches with jobId
]]
local function isJobSchedulerJob(jobId, jobKey, jobSchedulersKey)
  local repeatJobKey = rcall("HGET", jobKey, "rjk")
  if repeatJobKey  then
    local prevMillis = rcall("ZSCORE", jobSchedulersKey, repeatJobKey)
    if prevMillis then
      local currentDelayedJobId = "repeat:" .. repeatJobKey .. ":" .. prevMillis
      return jobId == currentDelayedJobId
    end
  end
  return false
end
--[[
  Function to recursively check if there are no locks
  on the jobs to be removed.
  returns:
    boolean
]]
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
local function isLocked( prefix, jobId, removeChildren)
  local jobKey = prefix .. jobId;
  -- Check if this job is locked
  local lockKey = jobKey .. ':lock'
  local lock = rcall("GET", lockKey)
  if not lock then
    if removeChildren == "1" then
      local dependencies = rcall("SMEMBERS", jobKey .. ":dependencies")
      if (#dependencies > 0) then
        for i, childJobKey in ipairs(dependencies) do
          -- We need to get the jobId for this job.
          local childJobId = getJobIdFromKey(childJobKey)
          local childJobPrefix = getJobKeyPrefix(childJobKey, childJobId)
          local result = isLocked( childJobPrefix, childJobId, removeChildren )
          if result then
            return true
          end
        end
      end
    end
    return false
  end
  return true
end
--[[
    Remove a job from all the statuses it may be in as well as all its data,
    including its children. Active children can be ignored.
    Events:
      'removed'
]]
local rcall = redis.call
-- Includes
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobKey, jobId)
  local deduplicationId = rcall("HGET", jobKey, "deid")
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      return rcall("DEL", deduplicationKey)
    end
  end
end
--[[
  Function to remove from any state.
  returns:
    prev state
]]
local function removeJobFromAnyState( prefix, jobId)
  -- We start with the ZSCORE checks, since they have O(1) complexity
  if rcall("ZSCORE", prefix .. "completed", jobId) then
    rcall("ZREM", prefix .. "completed", jobId)
    return "completed"
  elseif rcall("ZSCORE", prefix .. "waiting-children", jobId) then
    rcall("ZREM", prefix .. "waiting-children", jobId)
    return "waiting-children"
  elseif rcall("ZSCORE", prefix .. "delayed", jobId) then
    rcall("ZREM", prefix .. "delayed", jobId)
    return "delayed"
  elseif rcall("ZSCORE", prefix .. "failed", jobId) then
    rcall("ZREM", prefix .. "failed", jobId)
    return "failed"
  elseif rcall("ZSCORE", prefix .. "prioritized", jobId) then
    rcall("ZREM", prefix .. "prioritized", jobId)
    return "prioritized"
  -- We remove only 1 element from the list, since we assume they are not added multiple times
  elseif rcall("LREM", prefix .. "wait", 1, jobId) == 1 then
    return "wait"
  elseif rcall("LREM", prefix .. "paused", 1, jobId) == 1 then
    return "paused"
  elseif rcall("LREM", prefix .. "active", 1, jobId) == 1 then
    return "active"
  end
  return "unknown"
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
local removeJobChildren
local removeJobWithChildren
removeJobChildren = function(prefix, jobKey, options)
    -- Check if this job has children
    -- If so, we are going to try to remove the children recursively in a depth-first way
    -- because if some job is locked, we must exit with an error.
    if not options.ignoreProcessed then
        local processed = rcall("HGETALL", jobKey .. ":processed")
        if #processed > 0 then
            for i = 1, #processed, 2 do
                local childJobId = getJobIdFromKey(processed[i])
                local childJobPrefix = getJobKeyPrefix(processed[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
        local failed = rcall("HGETALL", jobKey .. ":failed")
        if #failed > 0 then
            for i = 1, #failed, 2 do
                local childJobId = getJobIdFromKey(failed[i])
                local childJobPrefix = getJobKeyPrefix(failed[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
        local unsuccessful = rcall("ZRANGE", jobKey .. ":unsuccessful", 0, -1)
        if #unsuccessful > 0 then
            for i = 1, #unsuccessful, 1 do
                local childJobId = getJobIdFromKey(unsuccessful[i])
                local childJobPrefix = getJobKeyPrefix(unsuccessful[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
    end
    local dependencies = rcall("SMEMBERS", jobKey .. ":dependencies")
    if #dependencies > 0 then
        for i, childJobKey in ipairs(dependencies) do
            local childJobId = getJobIdFromKey(childJobKey)
            local childJobPrefix = getJobKeyPrefix(childJobKey, childJobId)
            removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
        end
    end
end
removeJobWithChildren = function(prefix, jobId, parentKey, options)
    local jobKey = prefix .. jobId
    if options.ignoreLocked then
        if isLocked(prefix, jobId) then
            return
        end
    end
    -- Check if job is in the failed zset
    local failedSet = prefix .. "failed"
    if not (options.ignoreProcessed and rcall("ZSCORE", failedSet, jobId)) then
        removeParentDependencyKey(jobKey, false, parentKey, nil)
        if options.removeChildren then
            removeJobChildren(prefix, jobKey, options)
        end
        local prev = removeJobFromAnyState(prefix, jobId)
        removeDeduplicationKeyIfNeededOnRemoval(prefix, jobKey, jobId)
        if removeJobKeys(jobKey) > 0 then
            local metaKey = prefix .. "meta"
            local maxEvents = getOrSetMaxEvents(metaKey)
            rcall("XADD", prefix .. "events", "MAXLEN", "~", maxEvents, "*", "event", "removed",
                "jobId", jobId, "prev", prev)
        end
    end
end
local jobId = ARGV[1]
local shouldRemoveChildren = ARGV[2]
local prefix = ARGV[3]
local jobKey = KEYS[1]
local repeatKey = KEYS[2]
if isJobSchedulerJob(jobId, jobKey, repeatKey) then
    return -8
end
if not isLocked(prefix, jobId, shouldRemoveChildren) then
    local options = {
        removeChildren = shouldRemoveChildren == "1",
        ignoreProcessed = false,
        ignoreLocked = false
    }
    removeJobWithChildren(prefix, jobId, nil, options)
    return 1
end
return 0
`;t.removeJob={name:"removeJob",content:r,keys:2}},8501:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeJobScheduler=void 0;let r=`--[[
  Removes a job scheduler and its next scheduled job.
  Input:
    KEYS[1] job schedulers key
    KEYS[2] delayed jobs key
    KEYS[3] events key
    ARGV[1] job scheduler id
    ARGV[2] prefix key
  Output:
    0 - OK
    1 - Missing repeat job
  Events:
    'removed'
]]
local rcall = redis.call
-- Includes
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
local jobSchedulerId = ARGV[1]
local prefix = ARGV[2]
local millis = rcall("ZSCORE", KEYS[1], jobSchedulerId)
if millis then
  -- Delete next programmed job.
  local delayedJobId = "repeat:" .. jobSchedulerId .. ":" .. millis
  if(rcall("ZREM", KEYS[2], delayedJobId) == 1) then
    removeJobKeys(prefix .. delayedJobId)
    rcall("XADD", KEYS[3], "*", "event", "removed", "jobId", delayedJobId, "prev", "delayed")
  end
end
if(rcall("ZREM", KEYS[1], jobSchedulerId) == 1) then
  rcall("DEL", KEYS[1] .. ":" .. jobSchedulerId)
  return 0
end
return 1
`;t.removeJobScheduler={name:"removeJobScheduler",content:r,keys:3}},45366:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeRepeatable=void 0;let r=`--[[
  Removes a repeatable job
  Input:
    KEYS[1] repeat jobs key
    KEYS[2] delayed jobs key
    KEYS[3] events key
    ARGV[1] old repeat job id
    ARGV[2] options concat
    ARGV[3] repeat job key
    ARGV[4] prefix key
  Output:
    0 - OK
    1 - Missing repeat job
  Events:
    'removed'
]]
local rcall = redis.call
local millis = rcall("ZSCORE", KEYS[1], ARGV[2])
-- Includes
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
-- legacy removal TODO: remove in next breaking change
if millis then
  -- Delete next programmed job.
  local repeatJobId = ARGV[1] .. millis
  if(rcall("ZREM", KEYS[2], repeatJobId) == 1) then
    removeJobKeys(ARGV[4] .. repeatJobId)
    rcall("XADD", KEYS[3], "*", "event", "removed", "jobId", repeatJobId, "prev", "delayed");
  end
end
if(rcall("ZREM", KEYS[1], ARGV[2]) == 1) then
  return 0
end
-- new removal
millis = rcall("ZSCORE", KEYS[1], ARGV[3])
if millis then
  -- Delete next programmed job.
  local repeatJobId = "repeat:" .. ARGV[3] .. ":" .. millis
  if(rcall("ZREM", KEYS[2], repeatJobId) == 1) then
    removeJobKeys(ARGV[4] .. repeatJobId)
    rcall("XADD", KEYS[3], "*", "event", "removed", "jobId", repeatJobId, "prev", "delayed")
  end
end
if(rcall("ZREM", KEYS[1], ARGV[3]) == 1) then
  rcall("DEL", KEYS[1] .. ":" .. ARGV[3])
  return 0
end
return 1
`;t.removeRepeatable={name:"removeRepeatable",content:r,keys:3}},37529:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeUnprocessedChildren=void 0;let r=`--[[
    Remove a job from all the statuses it may be in as well as all its data.
    In order to be able to remove a job, it cannot be active.
    Input:
      KEYS[1] jobKey
      KEYS[2] meta key
      ARGV[1] prefix
      ARGV[2] jobId
    Events:
      'removed' for every children removed
]]
-- Includes
--[[
    Remove a job from all the statuses it may be in as well as all its data,
    including its children. Active children can be ignored.
    Events:
      'removed'
]]
local rcall = redis.call
-- Includes
--[[
  Functions to destructure job key.
  Just a bit of warning, these functions may be a bit slow and affect performance significantly.
]]
local getJobIdFromKey = function (jobKey)
  return string.match(jobKey, ".*:(.*)")
end
local getJobKeyPrefix = function (jobKey, jobId)
  return string.sub(jobKey, 0, #jobKey - #jobId)
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check if the job belongs to a job scheduler and
  current delayed job matches with jobId
]]
local function isJobSchedulerJob(jobId, jobKey, jobSchedulersKey)
  local repeatJobKey = rcall("HGET", jobKey, "rjk")
  if repeatJobKey  then
    local prevMillis = rcall("ZSCORE", jobSchedulersKey, repeatJobKey)
    if prevMillis then
      local currentDelayedJobId = "repeat:" .. repeatJobKey .. ":" .. prevMillis
      return jobId == currentDelayedJobId
    end
  end
  return false
end
--[[
  Function to remove deduplication key if needed
  when a job is being removed.
]]
local function removeDeduplicationKeyIfNeededOnRemoval(prefixKey,
  jobKey, jobId)
  local deduplicationId = rcall("HGET", jobKey, "deid")
  if deduplicationId then
    local deduplicationKey = prefixKey .. "de:" .. deduplicationId
    local currentJobId = rcall('GET', deduplicationKey)
    if currentJobId and currentJobId == jobId then
      return rcall("DEL", deduplicationKey)
    end
  end
end
--[[
  Function to remove from any state.
  returns:
    prev state
]]
local function removeJobFromAnyState( prefix, jobId)
  -- We start with the ZSCORE checks, since they have O(1) complexity
  if rcall("ZSCORE", prefix .. "completed", jobId) then
    rcall("ZREM", prefix .. "completed", jobId)
    return "completed"
  elseif rcall("ZSCORE", prefix .. "waiting-children", jobId) then
    rcall("ZREM", prefix .. "waiting-children", jobId)
    return "waiting-children"
  elseif rcall("ZSCORE", prefix .. "delayed", jobId) then
    rcall("ZREM", prefix .. "delayed", jobId)
    return "delayed"
  elseif rcall("ZSCORE", prefix .. "failed", jobId) then
    rcall("ZREM", prefix .. "failed", jobId)
    return "failed"
  elseif rcall("ZSCORE", prefix .. "prioritized", jobId) then
    rcall("ZREM", prefix .. "prioritized", jobId)
    return "prioritized"
  -- We remove only 1 element from the list, since we assume they are not added multiple times
  elseif rcall("LREM", prefix .. "wait", 1, jobId) == 1 then
    return "wait"
  elseif rcall("LREM", prefix .. "paused", 1, jobId) == 1 then
    return "paused"
  elseif rcall("LREM", prefix .. "active", 1, jobId) == 1 then
    return "active"
  end
  return "unknown"
end
--[[
  Function to remove job keys.
]]
local function removeJobKeys(jobKey)
  return rcall("DEL", jobKey, jobKey .. ':logs', jobKey .. ':dependencies',
    jobKey .. ':processed', jobKey .. ':failed', jobKey .. ':unsuccessful')
end
--[[
  Check if this job has a parent. If so we will just remove it from
  the parent child list, but if it is the last child we should move the parent to "wait/paused"
  which requires code from "moveToFinished"
]]
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local function _moveParentToWait(parentPrefix, parentId, emitEvent)
  local parentTarget, isPausedOrMaxed = getTargetQueueList(parentPrefix .. "meta", parentPrefix .. "active",
    parentPrefix .. "wait", parentPrefix .. "paused")
  addJobInTargetList(parentTarget, parentPrefix .. "marker", "RPUSH", isPausedOrMaxed, parentId)
  if emitEvent then
    local parentEventStream = parentPrefix .. "events"
    rcall("XADD", parentEventStream, "*", "event", "waiting", "jobId", parentId, "prev", "waiting-children")
  end
end
local function removeParentDependencyKey(jobKey, hard, parentKey, baseKey, debounceId)
  if parentKey then
    local parentDependenciesKey = parentKey .. ":dependencies"
    local result = rcall("SREM", parentDependenciesKey, jobKey)
    if result > 0 then
      local pendingDependencies = rcall("SCARD", parentDependenciesKey)
      if pendingDependencies == 0 then
        local parentId = getJobIdFromKey(parentKey)
        local parentPrefix = getJobKeyPrefix(parentKey, parentId)
        local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
        if numRemovedElements == 1 then
          if hard then -- remove parent in same queue
            if parentPrefix == baseKey then
              removeParentDependencyKey(parentKey, hard, nil, baseKey, nil)
              removeJobKeys(parentKey)
              if debounceId then
                rcall("DEL", parentPrefix .. "de:" .. debounceId)
              end
            else
              _moveParentToWait(parentPrefix, parentId)
            end
          else
            _moveParentToWait(parentPrefix, parentId, true)
          end
        end
      end
      return true
    end
  else
    local parentAttributes = rcall("HMGET", jobKey, "parentKey", "deid")
    local missedParentKey = parentAttributes[1]
    if( (type(missedParentKey) == "string") and missedParentKey ~= ""
      and (rcall("EXISTS", missedParentKey) == 1)) then
      local parentDependenciesKey = missedParentKey .. ":dependencies"
      local result = rcall("SREM", parentDependenciesKey, jobKey)
      if result > 0 then
        local pendingDependencies = rcall("SCARD", parentDependenciesKey)
        if pendingDependencies == 0 then
          local parentId = getJobIdFromKey(missedParentKey)
          local parentPrefix = getJobKeyPrefix(missedParentKey, parentId)
          local numRemovedElements = rcall("ZREM", parentPrefix .. "waiting-children", parentId)
          if numRemovedElements == 1 then
            if hard then
              if parentPrefix == baseKey then
                removeParentDependencyKey(missedParentKey, hard, nil, baseKey, nil)
                removeJobKeys(missedParentKey)
                if parentAttributes[2] then
                  rcall("DEL", parentPrefix .. "de:" .. parentAttributes[2])
                end
              else
                _moveParentToWait(parentPrefix, parentId)
              end
            else
              _moveParentToWait(parentPrefix, parentId, true)
            end
          end
        end
        return true
      end
    end
  end
  return false
end
--[[
  Function to recursively check if there are no locks
  on the jobs to be removed.
  returns:
    boolean
]]
local function isLocked( prefix, jobId, removeChildren)
  local jobKey = prefix .. jobId;
  -- Check if this job is locked
  local lockKey = jobKey .. ':lock'
  local lock = rcall("GET", lockKey)
  if not lock then
    if removeChildren == "1" then
      local dependencies = rcall("SMEMBERS", jobKey .. ":dependencies")
      if (#dependencies > 0) then
        for i, childJobKey in ipairs(dependencies) do
          -- We need to get the jobId for this job.
          local childJobId = getJobIdFromKey(childJobKey)
          local childJobPrefix = getJobKeyPrefix(childJobKey, childJobId)
          local result = isLocked( childJobPrefix, childJobId, removeChildren )
          if result then
            return true
          end
        end
      end
    end
    return false
  end
  return true
end
local removeJobChildren
local removeJobWithChildren
removeJobChildren = function(prefix, jobKey, options)
    -- Check if this job has children
    -- If so, we are going to try to remove the children recursively in a depth-first way
    -- because if some job is locked, we must exit with an error.
    if not options.ignoreProcessed then
        local processed = rcall("HGETALL", jobKey .. ":processed")
        if #processed > 0 then
            for i = 1, #processed, 2 do
                local childJobId = getJobIdFromKey(processed[i])
                local childJobPrefix = getJobKeyPrefix(processed[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
        local failed = rcall("HGETALL", jobKey .. ":failed")
        if #failed > 0 then
            for i = 1, #failed, 2 do
                local childJobId = getJobIdFromKey(failed[i])
                local childJobPrefix = getJobKeyPrefix(failed[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
        local unsuccessful = rcall("ZRANGE", jobKey .. ":unsuccessful", 0, -1)
        if #unsuccessful > 0 then
            for i = 1, #unsuccessful, 1 do
                local childJobId = getJobIdFromKey(unsuccessful[i])
                local childJobPrefix = getJobKeyPrefix(unsuccessful[i], childJobId)
                removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
            end
        end
    end
    local dependencies = rcall("SMEMBERS", jobKey .. ":dependencies")
    if #dependencies > 0 then
        for i, childJobKey in ipairs(dependencies) do
            local childJobId = getJobIdFromKey(childJobKey)
            local childJobPrefix = getJobKeyPrefix(childJobKey, childJobId)
            removeJobWithChildren(childJobPrefix, childJobId, jobKey, options)
        end
    end
end
removeJobWithChildren = function(prefix, jobId, parentKey, options)
    local jobKey = prefix .. jobId
    if options.ignoreLocked then
        if isLocked(prefix, jobId) then
            return
        end
    end
    -- Check if job is in the failed zset
    local failedSet = prefix .. "failed"
    if not (options.ignoreProcessed and rcall("ZSCORE", failedSet, jobId)) then
        removeParentDependencyKey(jobKey, false, parentKey, nil)
        if options.removeChildren then
            removeJobChildren(prefix, jobKey, options)
        end
        local prev = removeJobFromAnyState(prefix, jobId)
        removeDeduplicationKeyIfNeededOnRemoval(prefix, jobKey, jobId)
        if removeJobKeys(jobKey) > 0 then
            local metaKey = prefix .. "meta"
            local maxEvents = getOrSetMaxEvents(metaKey)
            rcall("XADD", prefix .. "events", "MAXLEN", "~", maxEvents, "*", "event", "removed",
                "jobId", jobId, "prev", prev)
        end
    end
end
local prefix = ARGV[1]
local jobId = ARGV[2]
local jobKey = KEYS[1]
local metaKey = KEYS[2]
local options = {
  removeChildren = "1",
  ignoreProcessed = true,
  ignoreLocked = true
}
removeJobChildren(prefix, jobKey, options) 
`;t.removeUnprocessedChildren={name:"removeUnprocessedChildren",content:r,keys:2}},69688:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.reprocessJob=void 0;let r=`--[[
  Attempts to reprocess a job
  Input:
    KEYS[1] job key
    KEYS[2] events stream
    KEYS[3] job state
    KEYS[4] wait key
    KEYS[5] meta
    KEYS[6] paused key
    KEYS[7] active key
    KEYS[8] marker key
    ARGV[1] job.id
    ARGV[2] (job.opts.lifo ? 'R' : 'L') + 'PUSH'
    ARGV[3] propVal - failedReason/returnvalue
    ARGV[4] prev state - failed/completed
  Output:
     1 means the operation was a success
    -1 means the job does not exist
    -3 means the job was not found in the expected set.
]]
local rcall = redis.call;
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
local jobKey = KEYS[1]
if rcall("EXISTS", jobKey) == 1 then
  local jobId = ARGV[1]
  if (rcall("ZREM", KEYS[3], jobId) == 1) then
    rcall("HDEL", jobKey, "finishedOn", "processedOn", ARGV[3])
    local target, isPausedOrMaxed = getTargetQueueList(KEYS[5], KEYS[7], KEYS[4], KEYS[6])
    addJobInTargetList(target, KEYS[8], ARGV[2], isPausedOrMaxed, jobId)
    local parentKey = rcall("HGET", jobKey, "parentKey")
    if parentKey and rcall("EXISTS", parentKey) == 1 then
      if ARGV[4] == "failed" then
        if rcall("ZREM", parentKey .. ":unsuccessful", jobKey) == 1 or
          rcall("ZREM", parentKey .. ":failed", jobKey) == 1 then
          rcall("SADD", parentKey .. ":dependencies", jobKey)
        end
      else
        if rcall("HDEL", parentKey .. ":processed", jobKey) == 1 then
          rcall("SADD", parentKey .. ":dependencies", jobKey)
        end
      end
    end
    local maxEvents = getOrSetMaxEvents(KEYS[5])
    -- Emit waiting event
    rcall("XADD", KEYS[2], "MAXLEN", "~", maxEvents, "*", "event", "waiting",
      "jobId", jobId, "prev", ARGV[4]);
    return 1
  else
    return -3
  end
else
  return -1
end
`;t.reprocessJob={name:"reprocessJob",content:r,keys:8}},88463:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.retryJob=void 0;let r=`--[[
  Retries a failed job by moving it back to the wait queue.
    Input:
      KEYS[1]  'active',
      KEYS[2]  'wait'
      KEYS[3]  'paused'
      KEYS[4]  job key
      KEYS[5]  'meta'
      KEYS[6]  events stream
      KEYS[7]  delayed key
      KEYS[8]  prioritized key
      KEYS[9]  'pc' priority counter
      KEYS[10] 'marker'
      KEYS[11] 'stalled'
      ARGV[1]  key prefix
      ARGV[2]  timestamp
      ARGV[3]  pushCmd
      ARGV[4]  jobId
      ARGV[5]  token
      ARGV[6]  optional job fields to update
    Events:
      'waiting'
    Output:
     0  - OK
     -1 - Missing key
     -2 - Missing lock
     -3 - Job not in active set
]]
local rcall = redis.call
-- Includes
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to check if queue is paused or maxed
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePausedOrMaxed(queueMetaKey, activeKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency")
  if queueAttributes[1] then
    return true
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      return activeCount >= tonumber(queueAttributes[2])
    end
  end
  return false
end
--[[
  Updates the delay set, by moving delayed jobs that should
  be processed now to "wait".
     Events:
      'waiting'
]]
-- Includes
-- Try to get as much as 1000 jobs at once
local function promoteDelayedJobs(delayedKey, markerKey, targetKey, prioritizedKey,
                                  eventStreamKey, prefix, timestamp, priorityCounterKey, isPaused)
    local jobs = rcall("ZRANGEBYSCORE", delayedKey, 0, (timestamp + 1) * 0x1000 - 1, "LIMIT", 0, 1000)
    if (#jobs > 0) then
        rcall("ZREM", delayedKey, unpack(jobs))
        for _, jobId in ipairs(jobs) do
            local jobKey = prefix .. jobId
            local priority =
                tonumber(rcall("HGET", jobKey, "priority")) or 0
            if priority == 0 then
                -- LIFO or FIFO
                rcall("LPUSH", targetKey, jobId)
            else
                local score = getPriorityScore(priority, priorityCounterKey)
                rcall("ZADD", prioritizedKey, score, jobId)
            end
            -- Emit waiting event
            rcall("XADD", eventStreamKey, "*", "event", "waiting", "jobId",
                  jobId, "prev", "delayed")
            rcall("HSET", jobKey, "delay", 0)
        end
        addBaseMarkerIfNeeded(markerKey, isPaused)
    end
end
local function removeLock(jobKey, stalledKey, token, jobId)
  if token ~= "0" then
    local lockKey = jobKey .. ':lock'
    local lockToken = rcall("GET", lockKey)
    if lockToken == token then
      rcall("DEL", lockKey)
      rcall("SREM", stalledKey, jobId)
    else
      if lockToken then
        -- Lock exists but token does not match
        return -6
      else
        -- Lock is missing completely
        return -2
      end
    end
  end
  return 0
end
--[[
  Function to update a bunch of fields in a job.
]]
local function updateJobFields(jobKey, msgpackedFields)
  if msgpackedFields and #msgpackedFields > 0 then
    local fieldsToUpdate = cmsgpack.unpack(msgpackedFields)
    if fieldsToUpdate then
      rcall("HMSET", jobKey, unpack(fieldsToUpdate))
    end
  end
end
local target, isPausedOrMaxed = getTargetQueueList(KEYS[5], KEYS[1], KEYS[2], KEYS[3])
local markerKey = KEYS[10]
-- Check if there are delayed jobs that we can move to wait.
-- test example: when there are delayed jobs between retries
promoteDelayedJobs(KEYS[7], markerKey, target, KEYS[8], KEYS[6], ARGV[1], ARGV[2], KEYS[9], isPausedOrMaxed)
local jobKey = KEYS[4]
if rcall("EXISTS", jobKey) == 1 then
  local errorCode = removeLock(jobKey, KEYS[11], ARGV[5], ARGV[4]) 
  if errorCode < 0 then
    return errorCode
  end
  updateJobFields(jobKey, ARGV[6])
  local numRemovedElements = rcall("LREM", KEYS[1], -1, ARGV[4])
  if (numRemovedElements < 1) then return -3 end
  local priority = tonumber(rcall("HGET", jobKey, "priority")) or 0
  --need to re-evaluate after removing job from active
  isPausedOrMaxed = isQueuePausedOrMaxed(KEYS[5], KEYS[1])
  -- Standard or priority add
  if priority == 0 then
    addJobInTargetList(target, markerKey, ARGV[3], isPausedOrMaxed, ARGV[4])
  else
    addJobWithPriority(markerKey, KEYS[8], priority, ARGV[4], KEYS[9], isPausedOrMaxed)
  end
  rcall("HINCRBY", jobKey, "atm", 1)
  local maxEvents = getOrSetMaxEvents(KEYS[5])
  -- Emit waiting event
  rcall("XADD", KEYS[6], "MAXLEN", "~", maxEvents, "*", "event", "waiting",
    "jobId", ARGV[4], "prev", "active")
  return 0
else
  return -1
end
`;t.retryJob={name:"retryJob",content:r,keys:11}},17252:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.saveStacktrace=void 0;let r=`--[[
  Save stacktrace and failedReason.
  Input:
    KEYS[1] job key
    ARGV[1]  stacktrace
    ARGV[2]  failedReason
  Output:
     0 - OK
    -1 - Missing key
]]
local rcall = redis.call
if rcall("EXISTS", KEYS[1]) == 1 then
  rcall("HMSET", KEYS[1], "stacktrace", ARGV[1], "failedReason", ARGV[2])
  return 0
else
  return -1
end
`;t.saveStacktrace={name:"saveStacktrace",content:r,keys:1}},67705:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.updateData=void 0;let r=`--[[
  Update job data
  Input:
    KEYS[1] Job id key
    ARGV[1] data
  Output:
    0 - OK
   -1 - Missing job.
]]
local rcall = redis.call
if rcall("EXISTS",KEYS[1]) == 1 then -- // Make sure job exists
  rcall("HSET", KEYS[1], "data", ARGV[1])
  return 0
else
  return -1
end
`;t.updateData={name:"updateData",content:r,keys:1}},78960:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.updateJobScheduler=void 0;let r=`--[[
  Updates a job scheduler and adds next delayed job
  Input:
    KEYS[1]  'repeat' key
    KEYS[2]  'delayed'
    KEYS[3]  'wait' key
    KEYS[4]  'paused' key
    KEYS[5]  'meta'
    KEYS[6]  'prioritized' key
    KEYS[7]  'marker',
    KEYS[8]  'id'
    KEYS[9]  events stream key
    KEYS[10] 'pc' priority counter
    KEYS[11] producer key
    KEYS[12] 'active' key
    ARGV[1] next milliseconds
    ARGV[2] jobs scheduler id
    ARGV[3] Json stringified delayed data
    ARGV[4] msgpacked delayed opts
    ARGV[5] timestamp
    ARGV[6] prefix key
    ARGV[7] producer id
    Output:
      next delayed job id  - OK
]] local rcall = redis.call
local repeatKey = KEYS[1]
local delayedKey = KEYS[2]
local waitKey = KEYS[3]
local pausedKey = KEYS[4]
local metaKey = KEYS[5]
local prioritizedKey = KEYS[6]
local nextMillis = tonumber(ARGV[1])
local jobSchedulerId = ARGV[2]
local timestamp = tonumber(ARGV[5])
local prefixKey = ARGV[6]
local producerId = ARGV[7]
local jobOpts = cmsgpack.unpack(ARGV[4])
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Adds a delayed job to the queue by doing the following:
    - Creates a new job key with the job data.
    - adds to delayed zset.
    - Emits a global event 'delayed' if the job is delayed.
]]
-- Includes
--[[
  Add delay marker if needed.
]]
-- Includes
--[[
  Function to return the next delayed job timestamp.
]]
local function getNextDelayedTimestamp(delayedKey)
  local result = rcall("ZRANGE", delayedKey, 0, 0, "WITHSCORES")
  if #result then
    local nextTimestamp = tonumber(result[2])
    if nextTimestamp ~= nil then
      return nextTimestamp / 0x1000
    end
  end
end
local function addDelayMarkerIfNeeded(markerKey, delayedKey)
  local nextTimestamp = getNextDelayedTimestamp(delayedKey)
  if nextTimestamp ~= nil then
    -- Replace the score of the marker with the newest known
    -- next timestamp.
    rcall("ZADD", markerKey, nextTimestamp, "1")
  end
end
--[[
  Bake in the job id first 12 bits into the timestamp
  to guarantee correct execution order of delayed jobs
  (up to 4096 jobs per given timestamp or 4096 jobs apart per timestamp)
  WARNING: Jobs that are so far apart that they wrap around will cause FIFO to fail
]]
local function getDelayedScore(delayedKey, timestamp, delay)
  local delayedTimestamp = (delay > 0 and (tonumber(timestamp) + delay)) or tonumber(timestamp)
  local minScore = delayedTimestamp * 0x1000
  local maxScore = (delayedTimestamp + 1 ) * 0x1000 - 1
  local result = rcall("ZREVRANGEBYSCORE", delayedKey, maxScore,
    minScore, "WITHSCORES","LIMIT", 0, 1)
  if #result then
    local currentMaxScore = tonumber(result[2])
    if currentMaxScore ~= nil then
      if currentMaxScore >= maxScore then
        return maxScore, delayedTimestamp
      else
        return currentMaxScore + 1, delayedTimestamp
      end
    end
  end
  return minScore, delayedTimestamp
end
local function addDelayedJob(jobId, delayedKey, eventsKey, timestamp,
  maxEvents, markerKey, delay)
  local score, delayedTimestamp = getDelayedScore(delayedKey, timestamp, tonumber(delay))
  rcall("ZADD", delayedKey, score, jobId)
  rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "delayed",
    "jobId", jobId, "delay", delayedTimestamp)
  -- mark that a delayed job is available
  addDelayMarkerIfNeeded(markerKey, delayedKey)
end
--[[
  Function to add job considering priority.
]]
-- Includes
--[[
  Add marker if needed when a job is available.
]]
local function addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
  if not isPausedOrMaxed then
    rcall("ZADD", markerKey, 0, "0")
  end  
end
--[[
  Function to get priority score.
]]
local function getPriorityScore(priority, priorityCounterKey)
  local prioCounter = rcall("INCR", priorityCounterKey)
  return priority * 0x100000000 + prioCounter % 0x100000000
end
local function addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounterKey,
  isPausedOrMaxed)
  local score = getPriorityScore(priority, priorityCounterKey)
  rcall("ZADD", prioritizedKey, score, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function isQueuePaused(queueMetaKey)
  return rcall("HEXISTS", queueMetaKey, "paused") == 1
end
--[[
  Function to store a job
]]
local function storeJob(eventsKey, jobIdKey, jobId, name, data, opts, timestamp,
                        parentKey, parentData, repeatJobKey)
    local jsonOpts = cjson.encode(opts)
    local delay = opts['delay'] or 0
    local priority = opts['priority'] or 0
    local debounceId = opts['de'] and opts['de']['id']
    local optionalValues = {}
    if parentKey ~= nil then
        table.insert(optionalValues, "parentKey")
        table.insert(optionalValues, parentKey)
        table.insert(optionalValues, "parent")
        table.insert(optionalValues, parentData)
    end
    if repeatJobKey then
        table.insert(optionalValues, "rjk")
        table.insert(optionalValues, repeatJobKey)
    end
    if debounceId then
        table.insert(optionalValues, "deid")
        table.insert(optionalValues, debounceId)
    end
    rcall("HMSET", jobIdKey, "name", name, "data", data, "opts", jsonOpts,
          "timestamp", timestamp, "delay", delay, "priority", priority,
          unpack(optionalValues))
    rcall("XADD", eventsKey, "*", "event", "added", "jobId", jobId, "name", name)
    return delay, priority
end
--[[
  Function to check for the meta.paused key to decide if we are paused or not
  (since an empty list and !EXISTS are not really the same).
]]
local function getTargetQueueList(queueMetaKey, activeKey, waitKey, pausedKey)
  local queueAttributes = rcall("HMGET", queueMetaKey, "paused", "concurrency", "max", "duration")
  if queueAttributes[1] then
    return pausedKey, true, queueAttributes[3], queueAttributes[4]
  else
    if queueAttributes[2] then
      local activeCount = rcall("LLEN", activeKey)
      if activeCount >= tonumber(queueAttributes[2]) then
        return waitKey, true, queueAttributes[3], queueAttributes[4]
      else
        return waitKey, false, queueAttributes[3], queueAttributes[4]
      end
    end
  end
  return waitKey, false, queueAttributes[3], queueAttributes[4]
end
--[[
  Function to add job in target list and add marker if needed.
]]
-- Includes
local function addJobInTargetList(targetKey, markerKey, pushCmd, isPausedOrMaxed, jobId)
  rcall(pushCmd, targetKey, jobId)
  addBaseMarkerIfNeeded(markerKey, isPausedOrMaxed)
end
local function addJobFromScheduler(jobKey, jobId, opts, waitKey, pausedKey, activeKey, metaKey, 
  prioritizedKey, priorityCounter, delayedKey, markerKey, eventsKey, name, maxEvents, timestamp,
  data, jobSchedulerId, repeatDelay)
  opts['delay'] = repeatDelay
  opts['jobId'] = jobId
  local delay, priority = storeJob(eventsKey, jobKey, jobId, name, data,
    opts, timestamp, nil, nil, jobSchedulerId)
  if delay ~= 0 then
    addDelayedJob(jobId, delayedKey, eventsKey, timestamp, maxEvents, markerKey, delay)
  else
    local target, isPausedOrMaxed = getTargetQueueList(metaKey, activeKey, waitKey, pausedKey)
    -- Standard or priority add
    if priority == 0 then
      local pushCmd = opts['lifo'] and 'RPUSH' or 'LPUSH'
      addJobInTargetList(target, markerKey, pushCmd, isPausedOrMaxed, jobId)
    else
      -- Priority add
      addJobWithPriority(markerKey, prioritizedKey, priority, jobId, priorityCounter, isPausedOrMaxed)
    end
    -- Emit waiting event
    rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents,  "*", "event", "waiting", "jobId", jobId)
  end
end
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
local function getJobSchedulerEveryNextMillis(prevMillis, every, now, offset, startDate)
    local nextMillis
    if not prevMillis then
        if startDate then
            -- Assuming startDate is passed as milliseconds from JavaScript
            nextMillis = tonumber(startDate)
            nextMillis = nextMillis > now and nextMillis or now
        else
            nextMillis = now
        end
    else
        nextMillis = prevMillis + every
        -- check if we may have missed some iterations
        if nextMillis < now then
            nextMillis = math.floor(now / every) * every + every + (offset or 0)
        end
    end
    if not offset or offset == 0 then
        local timeSlot = math.floor(nextMillis / every) * every;
        offset = nextMillis - timeSlot;
    end
    -- Return a tuple nextMillis, offset
    return math.floor(nextMillis), math.floor(offset)
end
local prevMillis = rcall("ZSCORE", repeatKey, jobSchedulerId)
-- Validate that scheduler exists.
-- If it does not exist we should not iterate anymore.
if prevMillis then
    prevMillis = tonumber(prevMillis)
    local schedulerKey = repeatKey .. ":" .. jobSchedulerId
    local schedulerAttributes = rcall("HMGET", schedulerKey, "name", "data", "every", "startDate", "offset")
    local every = tonumber(schedulerAttributes[3])
    local now = tonumber(timestamp)
    -- If every is not found in scheduler attributes, try to get it from job options
    if not every and jobOpts['repeat'] and jobOpts['repeat']['every'] then
        every = tonumber(jobOpts['repeat']['every'])
    end
    if every then
        local startDate = schedulerAttributes[4]
        local jobOptsOffset = jobOpts['repeat'] and jobOpts['repeat']['offset'] or 0
        local offset = schedulerAttributes[5] or jobOptsOffset or 0
        local newOffset
        nextMillis, newOffset = getJobSchedulerEveryNextMillis(prevMillis, every, now, offset, startDate)
        if not offset then
            rcall("HSET", schedulerKey, "offset", newOffset)
            jobOpts['repeat']['offset'] = newOffset
        end
    end
    local nextDelayedJobId = "repeat:" .. jobSchedulerId .. ":" .. nextMillis
    local nextDelayedJobKey = schedulerKey .. ":" .. nextMillis
    local currentDelayedJobId = "repeat:" .. jobSchedulerId .. ":" .. prevMillis
    if producerId == currentDelayedJobId then
        local eventsKey = KEYS[9]
        local maxEvents = getOrSetMaxEvents(metaKey)
        if rcall("EXISTS", nextDelayedJobKey) ~= 1 then
            rcall("ZADD", repeatKey, nextMillis, jobSchedulerId)
            rcall("HINCRBY", schedulerKey, "ic", 1)
            rcall("INCR", KEYS[8])
            -- TODO: remove this workaround in next breaking change,
            -- all job-schedulers must save job data
            local templateData = schedulerAttributes[2] or ARGV[3]
            if templateData and templateData ~= '{}' then
                rcall("HSET", schedulerKey, "data", templateData)
            end
            local delay = nextMillis - now
            -- Fast Clamp delay to minimum of 0
            if delay < 0 then
                delay = 0
            end
            jobOpts["delay"] = delay
            addJobFromScheduler(nextDelayedJobKey, nextDelayedJobId, jobOpts, waitKey, pausedKey, KEYS[12], metaKey,
                prioritizedKey, KEYS[10], delayedKey, KEYS[7], eventsKey, schedulerAttributes[1], maxEvents, ARGV[5],
                templateData or '{}', jobSchedulerId, delay)
            -- TODO: remove this workaround in next breaking change
            if KEYS[11] ~= "" then
                rcall("HSET", KEYS[11], "nrjid", nextDelayedJobId)
            end
            return nextDelayedJobId .. "" -- convert to string
        else
            rcall("XADD", eventsKey, "MAXLEN", "~", maxEvents, "*", "event", "duplicated", "jobId", nextDelayedJobId)
        end
    end
end
`;t.updateJobScheduler={name:"updateJobScheduler",content:r,keys:12}},54966:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.updateProgress=void 0;let r=`--[[
  Update job progress
  Input:
    KEYS[1] Job id key
    KEYS[2] event stream key
    KEYS[3] meta key
    ARGV[1] id
    ARGV[2] progress
  Output:
     0 - OK
    -1 - Missing job.
  Event:
    progress(jobId, progress)
]]
local rcall = redis.call
-- Includes
--[[
  Function to get max events value or set by default 10000.
]]
local function getOrSetMaxEvents(metaKey)
  local maxEvents = rcall("HGET", metaKey, "opts.maxLenEvents")
  if not maxEvents then
    maxEvents = 10000
    rcall("HSET", metaKey, "opts.maxLenEvents", maxEvents)
  end
  return maxEvents
end
if rcall("EXISTS", KEYS[1]) == 1 then -- // Make sure job exists
    local maxEvents = getOrSetMaxEvents(KEYS[3])
    rcall("HSET", KEYS[1], "progress", ARGV[2])
    rcall("XADD", KEYS[2], "MAXLEN", "~", maxEvents, "*", "event", "progress",
          "jobId", ARGV[1], "data", ARGV[2]);
    return 0
else
    return -1
end
`;t.updateProgress={name:"updateProgress",content:r,keys:3}},68531:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.updateRepeatableJobMillis=void 0;let r=`--[[
  Adds a repeatable job
    Input:
      KEYS[1] 'repeat' key
      ARGV[1] next milliseconds
      ARGV[2] custom key
      ARGV[3] legacy custom key TODO: remove this logic in next breaking change
      Output:
        repeatableKey  - OK
]]
local rcall = redis.call
local repeatKey = KEYS[1]
local nextMillis = ARGV[1]
local customKey = ARGV[2]
local legacyCustomKey = ARGV[3]
if rcall("ZSCORE", repeatKey, customKey) then
    rcall("ZADD", repeatKey, nextMillis, customKey)
    return customKey
elseif rcall("ZSCORE", repeatKey, legacyCustomKey) ~= false then
    rcall("ZADD", repeatKey, nextMillis, legacyCustomKey)
    return legacyCustomKey
end
return ''
`;t.updateRepeatableJobMillis={name:"updateRepeatableJobMillis",content:r,keys:1}},20563:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},39245:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},20301:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},46133:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(87175);n.__exportStar(r(20563),t),n.__exportStar(r(39245),t),n.__exportStar(r(20301),t),n.__exportStar(r(93481),t),n.__exportStar(r(47259),t),n.__exportStar(r(96772),t),n.__exportStar(r(40933),t),n.__exportStar(r(81773),t),n.__exportStar(r(57402),t)},93481:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},47259:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},81773:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},96772:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},40933:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},16079:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},57402:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},57669:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.createScripts=void 0;let n=r(96727);t.createScripts=e=>new n.Scripts({keys:e.keys,client:e.client,get redisVersion(){return e.redisVersion},toKey:e.toKey,opts:e.opts,closing:e.closing})},2394:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.QUEUE_EVENT_SUFFIX=t.toString=t.errorToJSON=t.parseObjectValues=t.isRedisVersionLowerThan=t.childSend=t.asyncSend=t.DELAY_TIME_1=t.DELAY_TIME_5=t.clientCommandMessageReg=t.optsEncodeMap=t.optsDecodeMap=t.errorObject=void 0,t.tryCatch=function(e,r,n){try{return e.apply(r,n)}catch(e){return t.errorObject.value=e,t.errorObject}},t.lengthInUtf8Bytes=function(e){return Buffer.byteLength(e,"utf8")},t.isEmpty=function(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0},t.array2obj=function(e){let t={};for(let r=0;r<e.length;r+=2)t[e[r]]=e[r+1];return t},t.objectToFlatArray=function(e){let t=[];for(let r in e)Object.prototype.hasOwnProperty.call(e,r)&&void 0!==e[r]&&(t[t.length]=r,t[t.length]=e[r]);return t},t.delay=function(e,t){return new Promise(r=>{let n;let callback=()=>{null==t||t.signal.removeEventListener("abort",callback),clearTimeout(n),r()};n=setTimeout(callback,e),null==t||t.signal.addEventListener("abort",callback)})},t.increaseMaxListeners=increaseMaxListeners,t.invertObject=invertObject,t.isRedisInstance=isRedisInstance,t.isRedisCluster=function(e){return isRedisInstance(e)&&e.isCluster},t.decreaseMaxListeners=function(e,t){increaseMaxListeners(e,-t)},t.removeAllQueueData=removeAllQueueData,t.getParentKey=function(e){if(e)return`${e.queue}:${e.id}`},t.isNotConnectionError=function(e){let{code:t,message:r}=e;return r!==a.CONNECTION_CLOSED_ERROR_MSG&&!r.includes("ECONNREFUSED")&&"ECONNREFUSED"!==t},t.removeUndefinedFields=function(e){let t={};for(let r in e)void 0!==e[r]&&(t[r]=e[r]);return t},t.trace=trace;let n=r(26277),a=r(27132),i=r(40342),o=r(90875);function increaseMaxListeners(e,t){let r=e.getMaxListeners();e.setMaxListeners(r+t)}function invertObject(e){return Object.entries(e).reduce((e,[t,r])=>(e[r]=t,e),{})}function isRedisInstance(e){return!!e&&["connect","disconnect","duplicate"].every(t=>"function"==typeof e[t])}async function removeAllQueueData(e,t,r=process.env.BULLMQ_TEST_PREFIX||"bull"){if(e instanceof n.Cluster)return Promise.resolve(!1);let a=`${r}:${t}:*`,i=await new Promise((t,r)=>{let n=e.scanStream({match:a});n.on("data",t=>{if(t.length){let n=e.pipeline();t.forEach(e=>{n.del(e)}),n.exec().catch(e=>{r(e)})}}),n.on("end",()=>t()),n.on("error",e=>r(e))});await i,await e.quit()}t.errorObject={value:null},t.optsDecodeMap={de:"deduplication",fpof:"failParentOnFailure",cpof:"continueParentOnFailure",idof:"ignoreDependencyOnFailure",kl:"keepLogs",rdof:"removeDependencyOnFailure"},t.optsEncodeMap=Object.assign(Object.assign({},invertObject(t.optsDecodeMap)),{debounce:"de"}),t.clientCommandMessageReg=/ERR unknown command ['`]\s*client\s*['`]/,t.DELAY_TIME_5=5e3,t.DELAY_TIME_1=100,t.asyncSend=(e,t)=>new Promise((r,n)=>{"function"==typeof e.send?e.send(t,e=>{e?n(e):r()}):"function"==typeof e.postMessage?r(e.postMessage(t)):r()}),t.childSend=(e,r)=>(0,t.asyncSend)(e,r),t.isRedisVersionLowerThan=(e,t)=>{let r=i.valid(i.coerce(e));return i.lt(r,t)},t.parseObjectValues=e=>{let t={};for(let r of Object.entries(e))t[r[0]]=JSON.parse(r[1]);return t};let getCircularReplacer=e=>{let t=new WeakSet;return t.add(e),(e,r)=>{if("object"==typeof r&&null!==r){if(t.has(r))return"[Circular]";t.add(r)}return r}};t.errorToJSON=e=>{let t={};return Object.getOwnPropertyNames(e).forEach(function(r){t[r]=e[r]}),JSON.parse(JSON.stringify(t,getCircularReplacer(e)))};let s=1/0;async function trace(e,t,r,n,a,i,s){if(!e)return i();{let l;let{tracer:d,contextManager:u}=e,c=u.active();s&&(l=u.fromMetadata(c,s));let p=a?`${n} ${a}`:n,y=d.startSpan(p,{kind:t},l);try{let e,a;return y.setAttributes({[o.TelemetryAttributes.QueueName]:r,[o.TelemetryAttributes.QueueOperation]:n}),e=t===o.SpanKind.CONSUMER&&l?y.setSpanOnContext(l):y.setSpanOnContext(c),2==i.length&&(a=u.getMetadata(e)),await u.with(e,()=>i(y,a))}catch(e){throw y.recordException(e),e}finally{y.end()}}}t.toString=e=>{if(null==e)return"";if("string"==typeof e)return e;if(Array.isArray(e))return`${e.map(e=>null==e?e:(0,t.toString)(e))}`;if("symbol"==typeof e||"[object Symbol]"==Object.prototype.toString.call(e))return e.toString();let r=`${e}`;return"0"===r&&1/e==-s?"-0":r},t.QUEUE_EVENT_SUFFIX=":qe"},94068:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.version=void 0,t.version="5.63.2"},20282:(e,t,r)=>{var n=r(90108);function CronDate(e,t){var r={zone:t};if(e?e instanceof CronDate?this._date=e._date:e instanceof Date?this._date=n.DateTime.fromJSDate(e,r):"number"==typeof e?this._date=n.DateTime.fromMillis(e,r):"string"==typeof e&&(this._date=n.DateTime.fromISO(e,r),this._date.isValid||(this._date=n.DateTime.fromRFC2822(e,r)),this._date.isValid||(this._date=n.DateTime.fromSQL(e,r)),this._date.isValid||(this._date=n.DateTime.fromFormat(e,"EEE, d MMM yyyy HH:mm:ss",r))):this._date=n.DateTime.local(),!this._date||!this._date.isValid)throw Error("CronDate: unhandled timestamp: "+JSON.stringify(e));t&&t!==this._date.zoneName&&(this._date=this._date.setZone(t))}CronDate.prototype.addYear=function(){this._date=this._date.plus({years:1})},CronDate.prototype.addMonth=function(){this._date=this._date.plus({months:1}).startOf("month")},CronDate.prototype.addDay=function(){this._date=this._date.plus({days:1}).startOf("day")},CronDate.prototype.addHour=function(){var e=this._date;this._date=this._date.plus({hours:1}).startOf("hour"),this._date<=e&&(this._date=this._date.plus({hours:1}))},CronDate.prototype.addMinute=function(){var e=this._date;this._date=this._date.plus({minutes:1}).startOf("minute"),this._date<e&&(this._date=this._date.plus({hours:1}))},CronDate.prototype.addSecond=function(){var e=this._date;this._date=this._date.plus({seconds:1}).startOf("second"),this._date<e&&(this._date=this._date.plus({hours:1}))},CronDate.prototype.subtractYear=function(){this._date=this._date.minus({years:1})},CronDate.prototype.subtractMonth=function(){this._date=this._date.minus({months:1}).endOf("month").startOf("second")},CronDate.prototype.subtractDay=function(){this._date=this._date.minus({days:1}).endOf("day").startOf("second")},CronDate.prototype.subtractHour=function(){var e=this._date;this._date=this._date.minus({hours:1}).endOf("hour").startOf("second"),this._date>=e&&(this._date=this._date.minus({hours:1}))},CronDate.prototype.subtractMinute=function(){var e=this._date;this._date=this._date.minus({minutes:1}).endOf("minute").startOf("second"),this._date>e&&(this._date=this._date.minus({hours:1}))},CronDate.prototype.subtractSecond=function(){var e=this._date;this._date=this._date.minus({seconds:1}).startOf("second"),this._date>e&&(this._date=this._date.minus({hours:1}))},CronDate.prototype.getDate=function(){return this._date.day},CronDate.prototype.getFullYear=function(){return this._date.year},CronDate.prototype.getDay=function(){var e=this._date.weekday;return 7==e?0:e},CronDate.prototype.getMonth=function(){return this._date.month-1},CronDate.prototype.getHours=function(){return this._date.hour},CronDate.prototype.getMinutes=function(){return this._date.minute},CronDate.prototype.getSeconds=function(){return this._date.second},CronDate.prototype.getMilliseconds=function(){return this._date.millisecond},CronDate.prototype.getTime=function(){return this._date.valueOf()},CronDate.prototype.getUTCDate=function(){return this._getUTC().day},CronDate.prototype.getUTCFullYear=function(){return this._getUTC().year},CronDate.prototype.getUTCDay=function(){var e=this._getUTC().weekday;return 7==e?0:e},CronDate.prototype.getUTCMonth=function(){return this._getUTC().month-1},CronDate.prototype.getUTCHours=function(){return this._getUTC().hour},CronDate.prototype.getUTCMinutes=function(){return this._getUTC().minute},CronDate.prototype.getUTCSeconds=function(){return this._getUTC().second},CronDate.prototype.toISOString=function(){return this._date.toUTC().toISO()},CronDate.prototype.toJSON=function(){return this._date.toJSON()},CronDate.prototype.setDate=function(e){this._date=this._date.set({day:e})},CronDate.prototype.setFullYear=function(e){this._date=this._date.set({year:e})},CronDate.prototype.setDay=function(e){this._date=this._date.set({weekday:e})},CronDate.prototype.setMonth=function(e){this._date=this._date.set({month:e+1})},CronDate.prototype.setHours=function(e){this._date=this._date.set({hour:e})},CronDate.prototype.setMinutes=function(e){this._date=this._date.set({minute:e})},CronDate.prototype.setSeconds=function(e){this._date=this._date.set({second:e})},CronDate.prototype.setMilliseconds=function(e){this._date=this._date.set({millisecond:e})},CronDate.prototype._getUTC=function(){return this._date.toUTC()},CronDate.prototype.toString=function(){return this.toDate().toString()},CronDate.prototype.toDate=function(){return this._date.toJSDate()},CronDate.prototype.isLastDayOfMonth=function(){var e=this._date.plus({days:1}).startOf("day");return this._date.month!==e.month},CronDate.prototype.isLastWeekdayOfMonth=function(){var e=this._date.plus({days:7}).startOf("day");return this._date.month!==e.month},e.exports=CronDate},4107:(e,t,r)=>{var n=r(20282),a=r(39945);function CronExpression(e,t){this._options=t,this._utc=t.utc||!1,this._tz=this._utc?"UTC":t.tz,this._currentDate=new n(t.currentDate,this._tz),this._startDate=t.startDate?new n(t.startDate,this._tz):null,this._endDate=t.endDate?new n(t.endDate,this._tz):null,this._isIterator=t.iterator||!1,this._hasIterated=!1,this._nthDayOfWeek=t.nthDayOfWeek||0,this.fields=CronExpression._freezeFields(e)}CronExpression.map=["second","minute","hour","dayOfMonth","month","dayOfWeek"],CronExpression.predefined={"@yearly":"0 0 1 1 *","@monthly":"0 0 1 * *","@weekly":"0 0 * * 0","@daily":"0 0 * * *","@hourly":"0 * * * *"},CronExpression.constraints=[{min:0,max:59,chars:[]},{min:0,max:59,chars:[]},{min:0,max:23,chars:[]},{min:1,max:31,chars:["L"]},{min:1,max:12,chars:[]},{min:0,max:7,chars:["L"]}],CronExpression.daysInMonth=[31,29,31,30,31,30,31,31,30,31,30,31],CronExpression.aliases={month:{jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12},dayOfWeek:{sun:0,mon:1,tue:2,wed:3,thu:4,fri:5,sat:6}},CronExpression.parseDefaults=["0","*","*","*","*","*"],CronExpression.standardValidCharacters=/^[,*\d/-]+$/,CronExpression.dayOfWeekValidCharacters=/^[?,*\dL#/-]+$/,CronExpression.dayOfMonthValidCharacters=/^[?,*\dL/-]+$/,CronExpression.validCharacters={second:CronExpression.standardValidCharacters,minute:CronExpression.standardValidCharacters,hour:CronExpression.standardValidCharacters,dayOfMonth:CronExpression.dayOfMonthValidCharacters,month:CronExpression.standardValidCharacters,dayOfWeek:CronExpression.dayOfWeekValidCharacters},CronExpression._isValidConstraintChar=function(e,t){return"string"==typeof t&&e.chars.some(function(e){return t.indexOf(e)>-1})},CronExpression._parseField=function(e,t,r){switch(e){case"month":case"dayOfWeek":var n=CronExpression.aliases[e];t=t.replace(/[a-z]{3}/gi,function(e){if(void 0!==n[e=e.toLowerCase()])return n[e];throw Error('Validation error, cannot resolve alias "'+e+'"')})}if(!CronExpression.validCharacters[e].test(t))throw Error("Invalid characters, got value: "+t);function parseRepeat(e){var t=e.split("/");if(t.length>2)throw Error("Invalid repeat: "+e);return t.length>1?(t[0]==+t[0]&&(t=[t[0]+"-"+r.max,t[1]]),parseRange(t[0],t[t.length-1])):parseRange(e,1)}function parseRange(t,n){var a=[],i=t.split("-");if(i.length>1){if(i.length<2)return+t;if(!i[0].length){if(!i[1].length)throw Error("Invalid range: "+t);return+t}var o=+i[0],s=+i[1];if(Number.isNaN(o)||Number.isNaN(s)||o<r.min||s>r.max)throw Error("Constraint error, got range "+o+"-"+s+" expected range "+r.min+"-"+r.max);if(o>s)throw Error("Invalid range: "+t);var l=+n;if(Number.isNaN(l)||l<=0)throw Error("Constraint error, cannot repeat at every "+l+" time.");"dayOfWeek"===e&&s%7==0&&a.push(0);for(var d=o;d<=s;d++)!(-1!==a.indexOf(d))&&l>0&&l%n==0?(l=1,a.push(d)):l++;return a}return Number.isNaN(+t)?t:+t}return -1!==t.indexOf("*")?t=t.replace(/\*/g,r.min+"-"+r.max):-1!==t.indexOf("?")&&(t=t.replace(/\?/g,r.min+"-"+r.max)),function(t){var n=[];function handleResult(t){if(t instanceof Array)for(var a=0,i=t.length;a<i;a++){var o=t[a];if(CronExpression._isValidConstraintChar(r,o)){n.push(o);continue}if("number"!=typeof o||Number.isNaN(o)||o<r.min||o>r.max)throw Error("Constraint error, got value "+o+" expected range "+r.min+"-"+r.max);n.push(o)}else{if(CronExpression._isValidConstraintChar(r,t)){n.push(t);return}var s=+t;if(Number.isNaN(s)||s<r.min||s>r.max)throw Error("Constraint error, got value "+t+" expected range "+r.min+"-"+r.max);"dayOfWeek"===e&&(s%=7),n.push(s)}}var a=t.split(",");if(!a.every(function(e){return e.length>0}))throw Error("Invalid list value format");if(a.length>1)for(var i=0,o=a.length;i<o;i++)handleResult(parseRepeat(a[i]));else handleResult(parseRepeat(t));return n.sort(CronExpression._sortCompareFn),n}(t)},CronExpression._sortCompareFn=function(e,t){var r="number"==typeof e,n="number"==typeof t;return r&&n?e-t:!r&&n?1:r&&!n?-1:e.localeCompare(t)},CronExpression._handleMaxDaysInMonth=function(e){if(1===e.month.length){var t=CronExpression.daysInMonth[e.month[0]-1];if(e.dayOfMonth[0]>t)throw Error("Invalid explicit day of month definition");return e.dayOfMonth.filter(function(e){return"L"===e||e<=t}).sort(CronExpression._sortCompareFn)}},CronExpression._freezeFields=function(e){for(var t=0,r=CronExpression.map.length;t<r;++t){var n=CronExpression.map[t],a=e[n];e[n]=Object.freeze(a)}return Object.freeze(e)},CronExpression.prototype._applyTimezoneShift=function(e,t,r){if("Month"===r||"Day"===r){var n=e.getTime();e[t+r](),n===e.getTime()&&(0===e.getMinutes()&&0===e.getSeconds()?e.addHour():59===e.getMinutes()&&59===e.getSeconds()&&e.subtractHour())}else{var a=e.getHours();e[t+r]();var i=e.getHours(),o=i-a;2===o?24!==this.fields.hour.length&&(this._dstStart=i):0===o&&0===e.getMinutes()&&0===e.getSeconds()&&24!==this.fields.hour.length&&(this._dstEnd=i)}},CronExpression.prototype._findSchedule=function(e){function matchSchedule(e,t){for(var r=0,n=t.length;r<n;r++)if(t[r]>=e)return t[r]===e;return t[0]===e}function isLInExpressions(e){return e.length>0&&e.some(function(e){return"string"==typeof e&&e.indexOf("L")>=0})}for(var t=(e=e||!1)?"subtract":"add",r=new n(this._currentDate,this._tz),a=this._startDate,i=this._endDate,o=r.getTime(),s=0;s<1e4;){if(s++,e){if(a&&r.getTime()-a.getTime()<0)throw Error("Out of the timespan range")}else if(i&&i.getTime()-r.getTime()<0)throw Error("Out of the timespan range");var l=matchSchedule(r.getDate(),this.fields.dayOfMonth);isLInExpressions(this.fields.dayOfMonth)&&(l=l||r.isLastDayOfMonth());var d=matchSchedule(r.getDay(),this.fields.dayOfWeek);isLInExpressions(this.fields.dayOfWeek)&&(d=d||this.fields.dayOfWeek.some(function(e){if(!isLInExpressions([e]))return!1;var t=Number.parseInt(e[0])%7;if(Number.isNaN(t))throw Error("Invalid last weekday of the month expression: "+e);return r.getDay()===t&&r.isLastWeekdayOfMonth()}));var u=this.fields.dayOfMonth.length>=CronExpression.daysInMonth[r.getMonth()],c=this.fields.dayOfWeek.length===CronExpression.constraints[5].max-CronExpression.constraints[5].min+1,p=r.getHours();if(!l&&(!d||c)||!u&&c&&!l||u&&!c&&!d||this._nthDayOfWeek>0&&!function(e,t){if(t<6){if(8>e.getDate()&&1===t)return!0;var r=e.getDate()%7?1:0;return Math.floor((e.getDate()-e.getDate()%7)/7)+r===t}return!1}(r,this._nthDayOfWeek)){this._applyTimezoneShift(r,t,"Day");continue}if(!matchSchedule(r.getMonth()+1,this.fields.month)){this._applyTimezoneShift(r,t,"Month");continue}if(matchSchedule(p,this.fields.hour)){if(this._dstEnd===p&&!e){this._dstEnd=null,this._applyTimezoneShift(r,"add","Hour");continue}}else{if(this._dstStart!==p){this._dstStart=null,this._applyTimezoneShift(r,t,"Hour");continue}if(!matchSchedule(p-1,this.fields.hour)){r[t+"Hour"]();continue}}if(!matchSchedule(r.getMinutes(),this.fields.minute)){this._applyTimezoneShift(r,t,"Minute");continue}if(!matchSchedule(r.getSeconds(),this.fields.second)){this._applyTimezoneShift(r,t,"Second");continue}if(o===r.getTime()){"add"===t||0===r.getMilliseconds()?this._applyTimezoneShift(r,t,"Second"):r.setMilliseconds(0);continue}break}if(s>=1e4)throw Error("Invalid expression, loop limit exceeded");return this._currentDate=new n(r,this._tz),this._hasIterated=!0,r},CronExpression.prototype.next=function(){var e=this._findSchedule();return this._isIterator?{value:e,done:!this.hasNext()}:e},CronExpression.prototype.prev=function(){var e=this._findSchedule(!0);return this._isIterator?{value:e,done:!this.hasPrev()}:e},CronExpression.prototype.hasNext=function(){var e=this._currentDate,t=this._hasIterated;try{return this._findSchedule(),!0}catch(e){return!1}finally{this._currentDate=e,this._hasIterated=t}},CronExpression.prototype.hasPrev=function(){var e=this._currentDate,t=this._hasIterated;try{return this._findSchedule(!0),!0}catch(e){return!1}finally{this._currentDate=e,this._hasIterated=t}},CronExpression.prototype.iterate=function(e,t){var r=[];if(e>=0)for(var n=0,a=e;n<a;n++)try{var i=this.next();r.push(i),t&&t(i,n)}catch(e){break}else for(var n=0,a=e;n>a;n--)try{var i=this.prev();r.push(i),t&&t(i,n)}catch(e){break}return r},CronExpression.prototype.reset=function(e){this._currentDate=new n(e||this._options.currentDate)},CronExpression.prototype.stringify=function(e){for(var t=[],r=e?0:1,n=CronExpression.map.length;r<n;++r){var i=CronExpression.map[r],o=this.fields[i],s=CronExpression.constraints[r];"dayOfMonth"===i&&1===this.fields.month.length?s={min:1,max:CronExpression.daysInMonth[this.fields.month[0]-1]}:"dayOfWeek"===i&&(s={min:0,max:6},o=7===o[o.length-1]?o.slice(0,-1):o),t.push(a(o,s.min,s.max))}return t.join(" ")},CronExpression.parse=function(e,t){var r=this;return"function"==typeof t&&(t={}),function(e,t){t||(t={}),void 0===t.currentDate&&(t.currentDate=new n(void 0,r._tz)),CronExpression.predefined[e]&&(e=CronExpression.predefined[e]);var a=[],i=(e+"").trim().split(/\s+/);if(i.length>6)throw Error("Invalid cron expression");for(var o=CronExpression.map.length-i.length,s=0,l=CronExpression.map.length;s<l;++s){var d=CronExpression.map[s],u=i[i.length>l?s:s-o];if(s<o||!u)a.push(CronExpression._parseField(d,CronExpression.parseDefaults[s],CronExpression.constraints[s]));else{var c="dayOfWeek"===d?function(e){var r=e.split("#");if(r.length>1){var n=+r[r.length-1];if(/,/.test(e))throw Error("Constraint error, invalid dayOfWeek `#` and `,` special characters are incompatible");if(/\//.test(e))throw Error("Constraint error, invalid dayOfWeek `#` and `/` special characters are incompatible");if(/-/.test(e))throw Error("Constraint error, invalid dayOfWeek `#` and `-` special characters are incompatible");if(r.length>2||Number.isNaN(n)||n<1||n>5)throw Error("Constraint error, invalid dayOfWeek occurrence number (#)");return t.nthDayOfWeek=n,r[0]}return e}(u):u;a.push(CronExpression._parseField(d,c,CronExpression.constraints[s]))}}for(var p={},s=0,l=CronExpression.map.length;s<l;s++)p[CronExpression.map[s]]=a[s];var y=CronExpression._handleMaxDaysInMonth(p);return p.dayOfMonth=y||p.dayOfMonth,new CronExpression(p,t)}(e,t)},CronExpression.fieldsToExpression=function(e,t){for(var r={},n=0,a=CronExpression.map.length;n<a;++n){var i=CronExpression.map[n],o=e[i];!function(e,t,r){if(!t)throw Error("Validation error, Field "+e+" is missing");if(0===t.length)throw Error("Validation error, Field "+e+" contains no values");for(var n=0,a=t.length;n<a;n++){var i=t[n];if(!CronExpression._isValidConstraintChar(r,i)&&("number"!=typeof i||Number.isNaN(i)||i<r.min||i>r.max))throw Error("Constraint error, got value "+i+" expected range "+r.min+"-"+r.max)}}(i,o,CronExpression.constraints[n]);for(var s=[],l=-1;++l<o.length;)s[l]=o[l];if((o=s.sort(CronExpression._sortCompareFn).filter(function(e,t,r){return!t||e!==r[t-1]})).length!==s.length)throw Error("Validation error, Field "+i+" contains duplicate values");r[i]=o}var d=CronExpression._handleMaxDaysInMonth(r);return r.dayOfMonth=d||r.dayOfMonth,new CronExpression(r,t||{})},e.exports=CronExpression},51018:e=>{function buildRange(e){return{start:e,count:1}}function completeRangeWithItem(e,t){e.end=t,e.step=t-e.start,e.count=2}function finalizeCurrentRange(e,t,r){t&&(2===t.count?(e.push(buildRange(t.start)),e.push(buildRange(t.end))):e.push(t)),r&&e.push(r)}e.exports=function(e){for(var t=[],r=void 0,n=0;n<e.length;n++){var a=e[n];"number"!=typeof a?(finalizeCurrentRange(t,r,buildRange(a)),r=void 0):r?1===r.count?completeRangeWithItem(r,a):r.step===a-r.end?(r.count++,r.end=a):2===r.count?(t.push(buildRange(r.start)),completeRangeWithItem(r=buildRange(r.end),a)):(finalizeCurrentRange(t,r),r=buildRange(a)):r=buildRange(a)}return finalizeCurrentRange(t,r),t}},39945:(e,t,r)=>{var n=r(51018);e.exports=function(e,t,r){var a=n(e);if(1===a.length){var i=a[0],o=i.step;if(1===o&&i.start===t&&i.end===r)return"*";if(1!==o&&i.start===t&&i.end===r-o+1)return"*/"+o}for(var s=[],l=0,d=a.length;l<d;++l){var u=a[l];if(1===u.count){s.push(u.start);continue}var o=u.step;if(1===u.step){s.push(u.start+"-"+u.end);continue}var c=0==u.start?u.count-1:u.count;u.step*c>u.end?s=s.concat(Array.from({length:u.end-u.start+1}).map(function(e,t){var r=u.start+t;return(r-u.start)%u.step==0?r:null}).filter(function(e){return null!=e})):u.end===r-u.step+1?s.push(u.start+"/"+u.step):s.push(u.start+"-"+u.end+"/"+u.step)}return s.join(",")}},96716:(e,t,r)=>{var n=r(4107);function CronParser(){}CronParser._parseEntry=function(e){var t=e.split(" ");if(6===t.length)return{interval:n.parse(e)};if(t.length>6)return{interval:n.parse(t.slice(0,6).join(" ")),command:t.slice(6,t.length)};throw Error("Invalid entry: "+e)},CronParser.parseExpression=function(e,t){return n.parse(e,t)},CronParser.fieldsToExpression=function(e,t){return n.fieldsToExpression(e,t)},CronParser.parseString=function(e){for(var t=e.split("\n"),r={variables:{},expressions:[],errors:{}},n=0,a=t.length;n<a;n++){var i=t[n],o=null,s=i.trim();if(s.length>0){if(s.match(/^#/))continue;if(o=s.match(/^(.*)=(.*)$/))r.variables[o[1]]=o[2];else{var l=null;try{l=CronParser._parseEntry("0 "+s),r.expressions.push(l.interval)}catch(e){r.errors[s]=e}}}}return r},CronParser.parseFile=function(e,t){r(57147).readFile(e,function(e,r){if(e){t(e);return}return t(null,CronParser.parseString(r.toString()))})},e.exports=CronParser},68819:(e,t,r)=>{let n,a,i;let o=r(32081),{isLinux:s,getReport:l}=r(77458),{LDD_PATH:d,SELF_PATH:u,readFile:c,readFileSync:p}=r(87688),{interpreterPath:y}=r(19544),m="getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true",h="",safeCommand=()=>h||new Promise(e=>{o.exec(m,(t,r)=>{e(h=t?" ":r)})}),safeCommandSync=()=>{if(!h)try{h=o.execSync(m,{encoding:"utf8"})}catch(e){h=" "}return h},f="glibc",b=/LIBC[a-z0-9 \-).]*?(\d+\.\d+)/i,K="musl",isFileMusl=e=>e.includes("libc.musl-")||e.includes("ld-musl-"),familyFromReport=()=>{let e=l();return e.header&&e.header.glibcVersionRuntime?f:Array.isArray(e.sharedObjects)&&e.sharedObjects.some(isFileMusl)?K:null},familyFromCommand=e=>{let[t,r]=e.split(/[\r\n]+/);return t&&t.includes(f)?f:r&&r.includes(K)?K:null},familyFromInterpreterPath=e=>{if(e){if(e.includes("/ld-musl-"))return K;if(e.includes("/ld-linux-"))return f}return null},getFamilyFromLddContent=e=>(e=e.toString()).includes("musl")?K:e.includes("GNU C Library")?f:null,familyFromFilesystem=async()=>{if(void 0!==a)return a;a=null;try{let e=await c(d);a=getFamilyFromLddContent(e)}catch(e){}return a},familyFromFilesystemSync=()=>{if(void 0!==a)return a;a=null;try{let e=p(d);a=getFamilyFromLddContent(e)}catch(e){}return a},familyFromInterpreter=async()=>{if(void 0!==n)return n;n=null;try{let e=await c(u),t=y(e);n=familyFromInterpreterPath(t)}catch(e){}return n},familyFromInterpreterSync=()=>{if(void 0!==n)return n;n=null;try{let e=p(u),t=y(e);n=familyFromInterpreterPath(t)}catch(e){}return n},family=async()=>{let e=null;if(s()&&!(e=await familyFromInterpreter())&&((e=await familyFromFilesystem())||(e=familyFromReport()),!e)){let t=await safeCommand();e=familyFromCommand(t)}return e},familySync=()=>{let e=null;if(s()&&!(e=familyFromInterpreterSync())&&((e=familyFromFilesystemSync())||(e=familyFromReport()),!e)){let t=safeCommandSync();e=familyFromCommand(t)}return e},isNonGlibcLinux=async()=>s()&&await family()!==f,versionFromFilesystem=async()=>{if(void 0!==i)return i;i=null;try{let e=await c(d),t=e.match(b);t&&(i=t[1])}catch(e){}return i},versionFromFilesystemSync=()=>{if(void 0!==i)return i;i=null;try{let e=p(d),t=e.match(b);t&&(i=t[1])}catch(e){}return i},versionFromReport=()=>{let e=l();return e.header&&e.header.glibcVersionRuntime?e.header.glibcVersionRuntime:null},versionSuffix=e=>e.trim().split(/\s+/)[1],versionFromCommand=e=>{let[t,r,n]=e.split(/[\r\n]+/);return t&&t.includes(f)?versionSuffix(t):r&&n&&r.includes(K)?versionSuffix(n):null},version=async()=>{let e=null;if(s()&&((e=await versionFromFilesystem())||(e=versionFromReport()),!e)){let t=await safeCommand();e=versionFromCommand(t)}return e};e.exports={GLIBC:f,MUSL:K,family,familySync,isNonGlibcLinux,isNonGlibcLinuxSync:()=>s()&&familySync()!==f,version,versionSync:()=>{let e=null;if(s()&&((e=versionFromFilesystemSync())||(e=versionFromReport()),!e)){let t=safeCommandSync();e=versionFromCommand(t)}return e}}},19544:e=>{e.exports={interpreterPath:e=>{if(e.length<64||2135247942!==e.readUInt32BE(0)||2!==e.readUInt8(4)||1!==e.readUInt8(5))return null;let t=e.readUInt32LE(32),r=e.readUInt16LE(54),n=e.readUInt16LE(56);for(let a=0;a<n;a++){let n=t+a*r,i=e.readUInt32LE(n);if(3===i){let t=e.readUInt32LE(n+8),r=e.readUInt32LE(n+32);return e.subarray(t,t+r).toString().replace(/\0.*$/g,"")}}return null}}},87688:(e,t,r)=>{let n=r(57147);e.exports={LDD_PATH:"/usr/bin/ldd",SELF_PATH:"/proc/self/exe",readFileSync:e=>{let t=n.openSync(e,"r"),r=Buffer.alloc(2048),a=n.readSync(t,r,0,2048,0);return n.close(t,()=>{}),r.subarray(0,a)},readFile:e=>new Promise((t,r)=>{n.open(e,"r",(e,a)=>{if(e)r(e);else{let e=Buffer.alloc(2048);n.read(a,e,0,2048,0,(r,i)=>{t(e.subarray(0,i)),n.close(a,()=>{})})}})})}},77458:e=>{let isLinux=()=>"linux"===process.platform,t=null;e.exports={isLinux,getReport:()=>{if(!t){if(isLinux()&&process.report){let e=process.report.excludeNetwork;process.report.excludeNetwork=!0,t=process.report.getReport(),process.report.excludeNetwork=e}else t={}}return t}}},90108:(e,t)=>{let r;Object.defineProperty(t,"__esModule",{value:!0});let LuxonError=class LuxonError extends Error{};let InvalidDateTimeError=class InvalidDateTimeError extends LuxonError{constructor(e){super(`Invalid DateTime: ${e.toMessage()}`)}};let InvalidIntervalError=class InvalidIntervalError extends LuxonError{constructor(e){super(`Invalid Interval: ${e.toMessage()}`)}};let InvalidDurationError=class InvalidDurationError extends LuxonError{constructor(e){super(`Invalid Duration: ${e.toMessage()}`)}};let ConflictingSpecificationError=class ConflictingSpecificationError extends LuxonError{};let InvalidUnitError=class InvalidUnitError extends LuxonError{constructor(e){super(`Invalid unit ${e}`)}};let InvalidArgumentError=class InvalidArgumentError extends LuxonError{};let ZoneIsAbstractError=class ZoneIsAbstractError extends LuxonError{constructor(){super("Zone is an abstract class")}};let n="numeric",a="short",i="long",o={year:n,month:n,day:n},s={year:n,month:a,day:n},l={year:n,month:a,day:n,weekday:a},d={year:n,month:i,day:n},u={year:n,month:i,day:n,weekday:i},c={hour:n,minute:n},p={hour:n,minute:n,second:n},y={hour:n,minute:n,second:n,timeZoneName:a},m={hour:n,minute:n,second:n,timeZoneName:i},h={hour:n,minute:n,hourCycle:"h23"},f={hour:n,minute:n,second:n,hourCycle:"h23"},b={hour:n,minute:n,second:n,hourCycle:"h23",timeZoneName:a},K={hour:n,minute:n,second:n,hourCycle:"h23",timeZoneName:i},g={year:n,month:n,day:n,hour:n,minute:n},v={year:n,month:n,day:n,hour:n,minute:n,second:n},I={year:n,month:a,day:n,hour:n,minute:n},E={year:n,month:a,day:n,hour:n,minute:n,second:n},S={year:n,month:a,day:n,weekday:a,hour:n,minute:n},j={year:n,month:i,day:n,hour:n,minute:n,timeZoneName:a},k={year:n,month:i,day:n,hour:n,minute:n,second:n,timeZoneName:a},x={year:n,month:i,day:n,weekday:i,hour:n,minute:n,timeZoneName:i},w={year:n,month:i,day:n,weekday:i,hour:n,minute:n,second:n,timeZoneName:i};let Zone=class Zone{get type(){throw new ZoneIsAbstractError}get name(){throw new ZoneIsAbstractError}get ianaName(){return this.name}get isUniversal(){throw new ZoneIsAbstractError}offsetName(e,t){throw new ZoneIsAbstractError}formatOffset(e,t){throw new ZoneIsAbstractError}offset(e){throw new ZoneIsAbstractError}equals(e){throw new ZoneIsAbstractError}get isValid(){throw new ZoneIsAbstractError}};let T=null;let SystemZone=class SystemZone extends Zone{static get instance(){return null===T&&(T=new SystemZone),T}get type(){return"system"}get name(){return new Intl.DateTimeFormat().resolvedOptions().timeZone}get isUniversal(){return!1}offsetName(e,{format:t,locale:r}){return parseZoneInfo(e,t,r)}formatOffset(e,t){return formatOffset(this.offset(e),t)}offset(e){return-new Date(e).getTimezoneOffset()}equals(e){return"system"===e.type}get isValid(){return!0}};let D=new Map,O={year:0,month:1,day:2,era:3,hour:4,minute:5,second:6},A=new Map;let IANAZone=class IANAZone extends Zone{static create(e){let t=A.get(e);return void 0===t&&A.set(e,t=new IANAZone(e)),t}static resetCache(){A.clear(),D.clear()}static isValidSpecifier(e){return this.isValidZone(e)}static isValidZone(e){if(!e)return!1;try{return new Intl.DateTimeFormat("en-US",{timeZone:e}).format(),!0}catch(e){return!1}}constructor(e){super(),this.zoneName=e,this.valid=IANAZone.isValidZone(e)}get type(){return"iana"}get name(){return this.zoneName}get isUniversal(){return!1}offsetName(e,{format:t,locale:r}){return parseZoneInfo(e,t,r,this.name)}formatOffset(e,t){return formatOffset(this.offset(e),t)}offset(e){var t;let r;if(!this.valid)return NaN;let n=new Date(e);if(isNaN(n))return NaN;let a=(t=this.name,void 0===(r=D.get(t))&&(r=new Intl.DateTimeFormat("en-US",{hour12:!1,timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",era:"short"}),D.set(t,r)),r),[i,o,s,l,d,u,c]=a.formatToParts?function(e,t){let r=e.formatToParts(t),n=[];for(let e=0;e<r.length;e++){let{type:t,value:a}=r[e],i=O[t];"era"===t?n[i]=a:isUndefined(i)||(n[i]=parseInt(a,10))}return n}(a,n):function(e,t){let r=e.format(t).replace(/\u200E/g,""),n=/(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(r),[,a,i,o,s,l,d,u]=n;return[o,a,i,s,l,d,u]}(a,n);"BC"===l&&(i=-Math.abs(i)+1);let p=objToLocalTS({year:i,month:o,day:s,hour:24===d?0:d,minute:u,second:c,millisecond:0}),y=+n,m=y%1e3;return(p-(y-=m>=0?m:1e3+m))/6e4}equals(e){return"iana"===e.type&&e.name===this.name}get isValid(){return this.valid}};let R={},P=new Map;function getCachedDTF(e,t={}){let r=JSON.stringify([e,t]),n=P.get(r);return void 0===n&&(n=new Intl.DateTimeFormat(e,t),P.set(r,n)),n}let C=new Map,M=new Map,_=null,J=new Map;function getCachedIntResolvedOptions(e){let t=J.get(e);return void 0===t&&(t=new Intl.DateTimeFormat(e).resolvedOptions(),J.set(e,t)),t}let L=new Map;function listStuff(e,t,r,n){let a=e.listingMode();return"error"===a?null:"en"===a?r(t):n(t)}let PolyNumberFormatter=class PolyNumberFormatter{constructor(e,t,r){this.padTo=r.padTo||0,this.floor=r.floor||!1;let{padTo:n,floor:a,...i}=r;if(!t||Object.keys(i).length>0){let t={useGrouping:!1,...r};r.padTo>0&&(t.minimumIntegerDigits=r.padTo),this.inf=function(e,t={}){let r=JSON.stringify([e,t]),n=C.get(r);return void 0===n&&(n=new Intl.NumberFormat(e,t),C.set(r,n)),n}(e,t)}}format(e){if(this.inf){let t=this.floor?Math.floor(e):e;return this.inf.format(t)}{let t=this.floor?Math.floor(e):roundTo(e,3);return padStart(t,this.padTo)}}};let PolyDateFormatter=class PolyDateFormatter{constructor(e,t,r){let n;if(this.opts=r,this.originalZone=void 0,this.opts.timeZone)this.dt=e;else if("fixed"===e.zone.type){let t=-1*(e.offset/60),r=t>=0?`Etc/GMT+${t}`:`Etc/GMT${t}`;0!==e.offset&&IANAZone.create(r).valid?(n=r,this.dt=e):(n="UTC",this.dt=0===e.offset?e:e.setZone("UTC").plus({minutes:e.offset}),this.originalZone=e.zone)}else"system"===e.zone.type?this.dt=e:"iana"===e.zone.type?(this.dt=e,n=e.zone.name):(n="UTC",this.dt=e.setZone("UTC").plus({minutes:e.offset}),this.originalZone=e.zone);let a={...this.opts};a.timeZone=a.timeZone||n,this.dtf=getCachedDTF(t,a)}format(){return this.originalZone?this.formatToParts().map(({value:e})=>e).join(""):this.dtf.format(this.dt.toJSDate())}formatToParts(){let e=this.dtf.formatToParts(this.dt.toJSDate());return this.originalZone?e.map(e=>{if("timeZoneName"!==e.type)return e;{let t=this.originalZone.offsetName(this.dt.ts,{locale:this.dt.locale,format:this.opts.timeZoneName});return{...e,value:t}}}):e}resolvedOptions(){return this.dtf.resolvedOptions()}};let PolyRelFormatter=class PolyRelFormatter{constructor(e,t,r){this.opts={style:"long",...r},!t&&hasRelative()&&(this.rtf=function(e,t={}){let{base:r,...n}=t,a=JSON.stringify([e,n]),i=M.get(a);return void 0===i&&(i=new Intl.RelativeTimeFormat(e,t),M.set(a,i)),i}(e,r))}format(e,t){return this.rtf?this.rtf.format(e,t):function(e,t,r="always",n=!1){let a={years:["year","yr."],quarters:["quarter","qtr."],months:["month","mo."],weeks:["week","wk."],days:["day","day","days"],hours:["hour","hr."],minutes:["minute","min."],seconds:["second","sec."]},i=-1===["hours","minutes","seconds"].indexOf(e);if("auto"===r&&i){let r="days"===e;switch(t){case 1:return r?"tomorrow":`next ${a[e][0]}`;case -1:return r?"yesterday":`last ${a[e][0]}`;case 0:return r?"today":`this ${a[e][0]}`}}let o=Object.is(t,-0)||t<0,s=Math.abs(t),l=1===s,d=a[e],u=n?l?d[1]:d[2]||d[1]:l?a[e][0]:e;return o?`${s} ${u} ago`:`in ${s} ${u}`}(t,e,this.opts.numeric,"long"!==this.opts.style)}formatToParts(e,t){return this.rtf?this.rtf.formatToParts(e,t):[]}};let N={firstDay:1,minimalDays:4,weekend:[6,7]};let Locale=class Locale{static fromOpts(e){return Locale.create(e.locale,e.numberingSystem,e.outputCalendar,e.weekSettings,e.defaultToEN)}static create(e,t,r,n,a=!1){let i=e||Settings.defaultLocale,o=i||(a?"en-US":_||(_=new Intl.DateTimeFormat().resolvedOptions().locale)),s=t||Settings.defaultNumberingSystem,l=r||Settings.defaultOutputCalendar,d=validateWeekSettings(n)||Settings.defaultWeekSettings;return new Locale(o,s,l,d,i)}static resetCache(){_=null,P.clear(),C.clear(),M.clear(),J.clear(),L.clear()}static fromObject({locale:e,numberingSystem:t,outputCalendar:r,weekSettings:n}={}){return Locale.create(e,t,r,n)}constructor(e,t,r,n,a){let[i,o,s]=function(e){let t=e.indexOf("-x-");-1!==t&&(e=e.substring(0,t));let r=e.indexOf("-u-");if(-1===r)return[e];{let t,n;try{t=getCachedDTF(e).resolvedOptions(),n=e}catch(i){let a=e.substring(0,r);t=getCachedDTF(a).resolvedOptions(),n=a}let{numberingSystem:a,calendar:i}=t;return[n,a,i]}}(e);this.locale=i,this.numberingSystem=t||o||null,this.outputCalendar=r||s||null,this.weekSettings=n,this.intl=function(e,t,r){return(r||t)&&(e.includes("-u-")||(e+="-u"),r&&(e+=`-ca-${r}`),t&&(e+=`-nu-${t}`)),e}(this.locale,this.numberingSystem,this.outputCalendar),this.weekdaysCache={format:{},standalone:{}},this.monthsCache={format:{},standalone:{}},this.meridiemCache=null,this.eraCache={},this.specifiedLocale=a,this.fastNumbersCached=null}get fastNumbers(){return null==this.fastNumbersCached&&(this.fastNumbersCached=(!this.numberingSystem||"latn"===this.numberingSystem)&&("latn"===this.numberingSystem||!this.locale||this.locale.startsWith("en")||"latn"===getCachedIntResolvedOptions(this.locale).numberingSystem)),this.fastNumbersCached}listingMode(){let e=this.isEnglish(),t=(null===this.numberingSystem||"latn"===this.numberingSystem)&&(null===this.outputCalendar||"gregory"===this.outputCalendar);return e&&t?"en":"intl"}clone(e){return e&&0!==Object.getOwnPropertyNames(e).length?Locale.create(e.locale||this.specifiedLocale,e.numberingSystem||this.numberingSystem,e.outputCalendar||this.outputCalendar,validateWeekSettings(e.weekSettings)||this.weekSettings,e.defaultToEN||!1):this}redefaultToEN(e={}){return this.clone({...e,defaultToEN:!0})}redefaultToSystem(e={}){return this.clone({...e,defaultToEN:!1})}months(e,t=!1){return listStuff(this,e,months,()=>{let r="ja"===this.intl||this.intl.startsWith("ja-");t&=!r;let n=t?{month:e,day:"numeric"}:{month:e},a=t?"format":"standalone";if(!this.monthsCache[a][e]){let t=r?e=>this.dtFormatter(e,n).format():e=>this.extract(e,n,"month");this.monthsCache[a][e]=function(e){let t=[];for(let r=1;r<=12;r++){let n=DateTime.utc(2009,r,1);t.push(e(n))}return t}(t)}return this.monthsCache[a][e]})}weekdays(e,t=!1){return listStuff(this,e,weekdays,()=>{let r=t?{weekday:e,year:"numeric",month:"long",day:"numeric"}:{weekday:e},n=t?"format":"standalone";return this.weekdaysCache[n][e]||(this.weekdaysCache[n][e]=function(e){let t=[];for(let r=1;r<=7;r++){let n=DateTime.utc(2016,11,13+r);t.push(e(n))}return t}(e=>this.extract(e,r,"weekday"))),this.weekdaysCache[n][e]})}meridiems(){return listStuff(this,void 0,()=>eo,()=>{if(!this.meridiemCache){let e={hour:"numeric",hourCycle:"h12"};this.meridiemCache=[DateTime.utc(2016,11,13,9),DateTime.utc(2016,11,13,19)].map(t=>this.extract(t,e,"dayperiod"))}return this.meridiemCache})}eras(e){return listStuff(this,e,eras,()=>{let t={era:e};return this.eraCache[e]||(this.eraCache[e]=[DateTime.utc(-40,1,1),DateTime.utc(2017,1,1)].map(e=>this.extract(e,t,"era"))),this.eraCache[e]})}extract(e,t,r){let n=this.dtFormatter(e,t),a=n.formatToParts(),i=a.find(e=>e.type.toLowerCase()===r);return i?i.value:null}numberFormatter(e={}){return new PolyNumberFormatter(this.intl,e.forceSimple||this.fastNumbers,e)}dtFormatter(e,t={}){return new PolyDateFormatter(e,this.intl,t)}relFormatter(e={}){return new PolyRelFormatter(this.intl,this.isEnglish(),e)}listFormatter(e={}){return function(e,t={}){let r=JSON.stringify([e,t]),n=R[r];return n||(n=new Intl.ListFormat(e,t),R[r]=n),n}(this.intl,e)}isEnglish(){return"en"===this.locale||"en-us"===this.locale.toLowerCase()||getCachedIntResolvedOptions(this.intl).locale.startsWith("en-us")}getWeekSettings(){return this.weekSettings?this.weekSettings:hasLocaleWeekInfo()?function(e){let t=L.get(e);if(!t){let r=new Intl.Locale(e);"minimalDays"in(t="getWeekInfo"in r?r.getWeekInfo():r.weekInfo)||(t={...N,...t}),L.set(e,t)}return t}(this.locale):N}getStartOfWeek(){return this.getWeekSettings().firstDay}getMinDaysInFirstWeek(){return this.getWeekSettings().minimalDays}getWeekendDays(){return this.getWeekSettings().weekend}equals(e){return this.locale===e.locale&&this.numberingSystem===e.numberingSystem&&this.outputCalendar===e.outputCalendar}toString(){return`Locale(${this.locale}, ${this.numberingSystem}, ${this.outputCalendar})`}};let F=null;let FixedOffsetZone=class FixedOffsetZone extends Zone{static get utcInstance(){return null===F&&(F=new FixedOffsetZone(0)),F}static instance(e){return 0===e?FixedOffsetZone.utcInstance:new FixedOffsetZone(e)}static parseSpecifier(e){if(e){let t=e.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);if(t)return new FixedOffsetZone(signedOffset(t[1],t[2]))}return null}constructor(e){super(),this.fixed=e}get type(){return"fixed"}get name(){return 0===this.fixed?"UTC":`UTC${formatOffset(this.fixed,"narrow")}`}get ianaName(){return 0===this.fixed?"Etc/UTC":`Etc/GMT${formatOffset(-this.fixed,"narrow")}`}offsetName(){return this.name}formatOffset(e,t){return formatOffset(this.fixed,t)}get isUniversal(){return!0}offset(){return this.fixed}equals(e){return"fixed"===e.type&&e.fixed===this.fixed}get isValid(){return!0}};let InvalidZone=class InvalidZone extends Zone{constructor(e){super(),this.zoneName=e}get type(){return"invalid"}get name(){return this.zoneName}get isUniversal(){return!1}offsetName(){return null}formatOffset(){return""}offset(){return NaN}equals(){return!1}get isValid(){return!1}};function normalizeZone(e,t){if(isUndefined(e)||null===e)return t;if(e instanceof Zone)return e;if("string"==typeof e){let r=e.toLowerCase();return"default"===r?t:"local"===r||"system"===r?SystemZone.instance:"utc"===r||"gmt"===r?FixedOffsetZone.utcInstance:FixedOffsetZone.parseSpecifier(r)||IANAZone.create(e)}return isNumber(e)?FixedOffsetZone.instance(e):"object"==typeof e&&"offset"in e&&"function"==typeof e.offset?e:new InvalidZone(e)}let V={arab:"[٠-٩]",arabext:"[۰-۹]",bali:"[᭐-᭙]",beng:"[০-৯]",deva:"[०-९]",fullwide:"[０-９]",gujr:"[૦-૯]",hanidec:"[〇|一|二|三|四|五|六|七|八|九]",khmr:"[០-៩]",knda:"[೦-೯]",laoo:"[໐-໙]",limb:"[᥆-᥏]",mlym:"[൦-൯]",mong:"[᠐-᠙]",mymr:"[၀-၉]",orya:"[୦-୯]",tamldec:"[௦-௯]",telu:"[౦-౯]",thai:"[๐-๙]",tibt:"[༠-༩]",latn:"\\d"},q={arab:[1632,1641],arabext:[1776,1785],bali:[6992,7001],beng:[2534,2543],deva:[2406,2415],fullwide:[65296,65303],gujr:[2790,2799],khmr:[6112,6121],knda:[3302,3311],laoo:[3792,3801],limb:[6470,6479],mlym:[3430,3439],mong:[6160,6169],mymr:[4160,4169],orya:[2918,2927],tamldec:[3046,3055],telu:[3174,3183],thai:[3664,3673],tibt:[3872,3881]},G=V.hanidec.replace(/[\[|\]]/g,"").split(""),Y=new Map;function digitRegex({numberingSystem:e},t=""){let r=e||"latn",n=Y.get(r);void 0===n&&(n=new Map,Y.set(r,n));let a=n.get(t);return void 0===a&&(a=RegExp(`${V[r]}${t}`),n.set(t,a)),a}let now=()=>Date.now(),W="system",U=null,$=null,Z=null,z=60,H,B=null;let Settings=class Settings{static get now(){return now}static set now(e){now=e}static set defaultZone(e){W=e}static get defaultZone(){return normalizeZone(W,SystemZone.instance)}static get defaultLocale(){return U}static set defaultLocale(e){U=e}static get defaultNumberingSystem(){return $}static set defaultNumberingSystem(e){$=e}static get defaultOutputCalendar(){return Z}static set defaultOutputCalendar(e){Z=e}static get defaultWeekSettings(){return B}static set defaultWeekSettings(e){B=validateWeekSettings(e)}static get twoDigitCutoffYear(){return z}static set twoDigitCutoffYear(e){z=e%100}static get throwOnInvalid(){return H}static set throwOnInvalid(e){H=e}static resetCaches(){Locale.resetCache(),IANAZone.resetCache(),DateTime.resetCache(),Y.clear()}};let Invalid=class Invalid{constructor(e,t){this.reason=e,this.explanation=t}toMessage(){return this.explanation?`${this.reason}: ${this.explanation}`:this.reason}};let X=[0,31,59,90,120,151,181,212,243,273,304,334],Q=[0,31,60,91,121,152,182,213,244,274,305,335];function unitOutOfRange(e,t){return new Invalid("unit out of range",`you specified ${t} (of type ${typeof t}) as a ${e}, which is invalid`)}function dayOfWeek(e,t,r){let n=new Date(Date.UTC(e,t-1,r));e<100&&e>=0&&n.setUTCFullYear(n.getUTCFullYear()-1900);let a=n.getUTCDay();return 0===a?7:a}function uncomputeOrdinal(e,t){let r=isLeapYear(e)?Q:X,n=r.findIndex(e=>e<t),a=t-r[n];return{month:n+1,day:a}}function isoWeekdayToLocal(e,t){return(e-t+7)%7+1}function gregorianToWeek(e,t=4,r=1){let{year:n,month:a,day:i}=e,o=i+(isLeapYear(n)?Q:X)[a-1],s=isoWeekdayToLocal(dayOfWeek(n,a,i),r),l=Math.floor((o-s+14-t)/7),d;return l<1?l=weeksInWeekYear(d=n-1,t,r):l>weeksInWeekYear(n,t,r)?(d=n+1,l=1):d=n,{weekYear:d,weekNumber:l,weekday:s,...timeObject(e)}}function weekToGregorian(e,t=4,r=1){let{weekYear:n,weekNumber:a,weekday:i}=e,o=isoWeekdayToLocal(dayOfWeek(n,1,t),r),s=daysInYear(n),l=7*a+i-o-7+t,d;l<1?l+=daysInYear(d=n-1):l>s?(d=n+1,l-=daysInYear(n)):d=n;let{month:u,day:c}=uncomputeOrdinal(d,l);return{year:d,month:u,day:c,...timeObject(e)}}function gregorianToOrdinal(e){let{year:t,month:r,day:n}=e,a=n+(isLeapYear(t)?Q:X)[r-1];return{year:t,ordinal:a,...timeObject(e)}}function ordinalToGregorian(e){let{year:t,ordinal:r}=e,{month:n,day:a}=uncomputeOrdinal(t,r);return{year:t,month:n,day:a,...timeObject(e)}}function usesLocalWeekValues(e,t){let r=!isUndefined(e.localWeekday)||!isUndefined(e.localWeekNumber)||!isUndefined(e.localWeekYear);if(!r)return{minDaysInFirstWeek:4,startOfWeek:1};{let r=!isUndefined(e.weekday)||!isUndefined(e.weekNumber)||!isUndefined(e.weekYear);if(r)throw new ConflictingSpecificationError("Cannot mix locale-based week fields with ISO-based week fields");return isUndefined(e.localWeekday)||(e.weekday=e.localWeekday),isUndefined(e.localWeekNumber)||(e.weekNumber=e.localWeekNumber),isUndefined(e.localWeekYear)||(e.weekYear=e.localWeekYear),delete e.localWeekday,delete e.localWeekNumber,delete e.localWeekYear,{minDaysInFirstWeek:t.getMinDaysInFirstWeek(),startOfWeek:t.getStartOfWeek()}}}function hasInvalidGregorianData(e){let t=isInteger(e.year),r=integerBetween(e.month,1,12),n=integerBetween(e.day,1,daysInMonth(e.year,e.month));return t?r?!n&&unitOutOfRange("day",e.day):unitOutOfRange("month",e.month):unitOutOfRange("year",e.year)}function hasInvalidTimeData(e){let{hour:t,minute:r,second:n,millisecond:a}=e,i=integerBetween(t,0,23)||24===t&&0===r&&0===n&&0===a,o=integerBetween(r,0,59),s=integerBetween(n,0,59),l=integerBetween(a,0,999);return i?o?s?!l&&unitOutOfRange("millisecond",a):unitOutOfRange("second",n):unitOutOfRange("minute",r):unitOutOfRange("hour",t)}function isUndefined(e){return void 0===e}function isNumber(e){return"number"==typeof e}function isInteger(e){return"number"==typeof e&&e%1==0}function hasRelative(){try{return"undefined"!=typeof Intl&&!!Intl.RelativeTimeFormat}catch(e){return!1}}function hasLocaleWeekInfo(){try{return"undefined"!=typeof Intl&&!!Intl.Locale&&("weekInfo"in Intl.Locale.prototype||"getWeekInfo"in Intl.Locale.prototype)}catch(e){return!1}}function bestBy(e,t,r){if(0!==e.length)return e.reduce((e,n)=>{let a=[t(n),n];return e&&r(e[0],a[0])===e[0]?e:a},null)[1]}function hasOwnProperty(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function validateWeekSettings(e){if(null==e)return null;if("object"!=typeof e)throw new InvalidArgumentError("Week settings must be an object");if(!integerBetween(e.firstDay,1,7)||!integerBetween(e.minimalDays,1,7)||!Array.isArray(e.weekend)||e.weekend.some(e=>!integerBetween(e,1,7)))throw new InvalidArgumentError("Invalid week settings");return{firstDay:e.firstDay,minimalDays:e.minimalDays,weekend:Array.from(e.weekend)}}function integerBetween(e,t,r){return isInteger(e)&&e>=t&&e<=r}function padStart(e,t=2){return e<0?"-"+(""+-e).padStart(t,"0"):(""+e).padStart(t,"0")}function parseInteger(e){if(!isUndefined(e)&&null!==e&&""!==e)return parseInt(e,10)}function parseFloating(e){if(!isUndefined(e)&&null!==e&&""!==e)return parseFloat(e)}function parseMillis(e){if(!isUndefined(e)&&null!==e&&""!==e){let t=1e3*parseFloat("0."+e);return Math.floor(t)}}function roundTo(e,t,r="round"){let n=10**t;switch(r){case"expand":return e>0?Math.ceil(e*n)/n:Math.floor(e*n)/n;case"trunc":return Math.trunc(e*n)/n;case"round":return Math.round(e*n)/n;case"floor":return Math.floor(e*n)/n;case"ceil":return Math.ceil(e*n)/n;default:throw RangeError(`Value rounding ${r} is out of range`)}}function isLeapYear(e){return e%4==0&&(e%100!=0||e%400==0)}function daysInYear(e){return isLeapYear(e)?366:365}function daysInMonth(e,t){var r;let n=(r=t-1)-12*Math.floor(r/12)+1;return 2===n?isLeapYear(e+(t-n)/12)?29:28:[31,null,31,30,31,30,31,31,30,31,30,31][n-1]}function objToLocalTS(e){let t=Date.UTC(e.year,e.month-1,e.day,e.hour,e.minute,e.second,e.millisecond);return e.year<100&&e.year>=0&&(t=new Date(t)).setUTCFullYear(e.year,e.month-1,e.day),+t}function firstWeekOffset(e,t,r){let n=isoWeekdayToLocal(dayOfWeek(e,1,t),r);return-n+t-1}function weeksInWeekYear(e,t=4,r=1){let n=firstWeekOffset(e,t,r),a=firstWeekOffset(e+1,t,r);return(daysInYear(e)-n+a)/7}function untruncateYear(e){return e>99?e:e>Settings.twoDigitCutoffYear?1900+e:2e3+e}function parseZoneInfo(e,t,r,n=null){let a=new Date(e),i={hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"};n&&(i.timeZone=n);let o={timeZoneName:t,...i},s=new Intl.DateTimeFormat(r,o).formatToParts(a).find(e=>"timezonename"===e.type.toLowerCase());return s?s.value:null}function signedOffset(e,t){let r=parseInt(e,10);Number.isNaN(r)&&(r=0);let n=parseInt(t,10)||0,a=r<0||Object.is(r,-0)?-n:n;return 60*r+a}function asNumber(e){let t=Number(e);if("boolean"==typeof e||""===e||!Number.isFinite(t))throw new InvalidArgumentError(`Invalid unit value ${e}`);return t}function normalizeObject(e,t){let r={};for(let n in e)if(hasOwnProperty(e,n)){let a=e[n];if(null==a)continue;r[t(n)]=asNumber(a)}return r}function formatOffset(e,t){let r=Math.trunc(Math.abs(e/60)),n=Math.trunc(Math.abs(e%60)),a=e>=0?"+":"-";switch(t){case"short":return`${a}${padStart(r,2)}:${padStart(n,2)}`;case"narrow":return`${a}${r}${n>0?`:${n}`:""}`;case"techie":return`${a}${padStart(r,2)}${padStart(n,2)}`;default:throw RangeError(`Value format ${t} is out of range for property format`)}}function timeObject(e){return["hour","minute","second","millisecond"].reduce((t,r)=>(t[r]=e[r],t),{})}let ee=["January","February","March","April","May","June","July","August","September","October","November","December"],et=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],er=["J","F","M","A","M","J","J","A","S","O","N","D"];function months(e){switch(e){case"narrow":return[...er];case"short":return[...et];case"long":return[...ee];case"numeric":return["1","2","3","4","5","6","7","8","9","10","11","12"];case"2-digit":return["01","02","03","04","05","06","07","08","09","10","11","12"];default:return null}}let en=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],ea=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],ei=["M","T","W","T","F","S","S"];function weekdays(e){switch(e){case"narrow":return[...ei];case"short":return[...ea];case"long":return[...en];case"numeric":return["1","2","3","4","5","6","7"];default:return null}}let eo=["AM","PM"],es=["Before Christ","Anno Domini"],el=["BC","AD"],ed=["B","A"];function eras(e){switch(e){case"narrow":return[...ed];case"short":return[...el];case"long":return[...es];default:return null}}function stringifyTokens(e,t){let r="";for(let n of e)n.literal?r+=n.val:r+=t(n.val);return r}let eu={D:o,DD:s,DDD:d,DDDD:u,t:c,tt:p,ttt:y,tttt:m,T:h,TT:f,TTT:b,TTTT:K,f:g,ff:I,fff:j,ffff:x,F:v,FF:E,FFF:k,FFFF:w};let Formatter=class Formatter{static create(e,t={}){return new Formatter(e,t)}static parseFormat(e){let t=null,r="",n=!1,a=[];for(let i=0;i<e.length;i++){let o=e.charAt(i);"'"===o?((r.length>0||n)&&a.push({literal:n||/^\s+$/.test(r),val:""===r?"'":r}),t=null,r="",n=!n):n?r+=o:o===t?r+=o:(r.length>0&&a.push({literal:/^\s+$/.test(r),val:r}),r=o,t=o)}return r.length>0&&a.push({literal:n||/^\s+$/.test(r),val:r}),a}static macroTokenToFormatOpts(e){return eu[e]}constructor(e,t){this.opts=t,this.loc=e,this.systemLoc=null}formatWithSystemDefault(e,t){null===this.systemLoc&&(this.systemLoc=this.loc.redefaultToSystem());let r=this.systemLoc.dtFormatter(e,{...this.opts,...t});return r.format()}dtFormatter(e,t={}){return this.loc.dtFormatter(e,{...this.opts,...t})}formatDateTime(e,t){return this.dtFormatter(e,t).format()}formatDateTimeParts(e,t){return this.dtFormatter(e,t).formatToParts()}formatInterval(e,t){let r=this.dtFormatter(e.start,t);return r.dtf.formatRange(e.start.toJSDate(),e.end.toJSDate())}resolvedOptions(e,t){return this.dtFormatter(e,t).resolvedOptions()}num(e,t=0,r){if(this.opts.forceSimple)return padStart(e,t);let n={...this.opts};return t>0&&(n.padTo=t),r&&(n.signDisplay=r),this.loc.numberFormatter(n).format(e)}formatDateTimeFromString(e,t){let r="en"===this.loc.listingMode(),n=this.loc.outputCalendar&&"gregory"!==this.loc.outputCalendar,string=(t,r)=>this.loc.extract(e,t,r),formatOffset=t=>e.isOffsetFixed&&0===e.offset&&t.allowZ?"Z":e.isValid?e.zone.formatOffset(e.ts,t.format):"",meridiem=()=>r?eo[e.hour<12?0:1]:string({hour:"numeric",hourCycle:"h12"},"dayperiod"),month=(t,n)=>r?months(t)[e.month-1]:string(n?{month:t}:{month:t,day:"numeric"},"month"),weekday=(t,n)=>r?weekdays(t)[e.weekday-1]:string(n?{weekday:t}:{weekday:t,month:"long",day:"numeric"},"weekday"),maybeMacro=t=>{let r=Formatter.macroTokenToFormatOpts(t);return r?this.formatWithSystemDefault(e,r):t},era=t=>r?eras(t)[e.year<0?0:1]:string({era:t},"era");return stringifyTokens(Formatter.parseFormat(t),t=>{switch(t){case"S":return this.num(e.millisecond);case"u":case"SSS":return this.num(e.millisecond,3);case"s":return this.num(e.second);case"ss":return this.num(e.second,2);case"uu":return this.num(Math.floor(e.millisecond/10),2);case"uuu":return this.num(Math.floor(e.millisecond/100));case"m":return this.num(e.minute);case"mm":return this.num(e.minute,2);case"h":return this.num(e.hour%12==0?12:e.hour%12);case"hh":return this.num(e.hour%12==0?12:e.hour%12,2);case"H":return this.num(e.hour);case"HH":return this.num(e.hour,2);case"Z":return formatOffset({format:"narrow",allowZ:this.opts.allowZ});case"ZZ":return formatOffset({format:"short",allowZ:this.opts.allowZ});case"ZZZ":return formatOffset({format:"techie",allowZ:this.opts.allowZ});case"ZZZZ":return e.zone.offsetName(e.ts,{format:"short",locale:this.loc.locale});case"ZZZZZ":return e.zone.offsetName(e.ts,{format:"long",locale:this.loc.locale});case"z":return e.zoneName;case"a":return meridiem();case"d":return n?string({day:"numeric"},"day"):this.num(e.day);case"dd":return n?string({day:"2-digit"},"day"):this.num(e.day,2);case"c":case"E":return this.num(e.weekday);case"ccc":return weekday("short",!0);case"cccc":return weekday("long",!0);case"ccccc":return weekday("narrow",!0);case"EEE":return weekday("short",!1);case"EEEE":return weekday("long",!1);case"EEEEE":return weekday("narrow",!1);case"L":return n?string({month:"numeric",day:"numeric"},"month"):this.num(e.month);case"LL":return n?string({month:"2-digit",day:"numeric"},"month"):this.num(e.month,2);case"LLL":return month("short",!0);case"LLLL":return month("long",!0);case"LLLLL":return month("narrow",!0);case"M":return n?string({month:"numeric"},"month"):this.num(e.month);case"MM":return n?string({month:"2-digit"},"month"):this.num(e.month,2);case"MMM":return month("short",!1);case"MMMM":return month("long",!1);case"MMMMM":return month("narrow",!1);case"y":return n?string({year:"numeric"},"year"):this.num(e.year);case"yy":return n?string({year:"2-digit"},"year"):this.num(e.year.toString().slice(-2),2);case"yyyy":return n?string({year:"numeric"},"year"):this.num(e.year,4);case"yyyyyy":return n?string({year:"numeric"},"year"):this.num(e.year,6);case"G":return era("short");case"GG":return era("long");case"GGGGG":return era("narrow");case"kk":return this.num(e.weekYear.toString().slice(-2),2);case"kkkk":return this.num(e.weekYear,4);case"W":return this.num(e.weekNumber);case"WW":return this.num(e.weekNumber,2);case"n":return this.num(e.localWeekNumber);case"nn":return this.num(e.localWeekNumber,2);case"ii":return this.num(e.localWeekYear.toString().slice(-2),2);case"iiii":return this.num(e.localWeekYear,4);case"o":return this.num(e.ordinal);case"ooo":return this.num(e.ordinal,3);case"q":return this.num(e.quarter);case"qq":return this.num(e.quarter,2);case"X":return this.num(Math.floor(e.ts/1e3));case"x":return this.num(e.ts);default:return maybeMacro(t)}})}formatDurationFromString(e,t){let r="negativeLargestOnly"===this.opts.signMode?-1:1,tokenToField=e=>{switch(e[0]){case"S":return"milliseconds";case"s":return"seconds";case"m":return"minutes";case"h":return"hours";case"d":return"days";case"w":return"weeks";case"M":return"months";case"y":return"years";default:return null}},n=Formatter.parseFormat(t),a=n.reduce((e,{literal:t,val:r})=>t?e:e.concat(r),[]),i=e.shiftTo(...a.map(tokenToField).filter(e=>e)),o={isNegativeDuration:i<0,largestUnit:Object.keys(i.values)[0]};return stringifyTokens(n,e=>{let t=tokenToField(e);if(!t)return e;{let n;let a=o.isNegativeDuration&&t!==o.largestUnit?r:1;return n="negativeLargestOnly"===this.opts.signMode&&t!==o.largestUnit?"never":"all"===this.opts.signMode?"always":"auto",this.num(i.get(t)*a,e.length,n)}})}};let ec=/[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;function combineRegexes(...e){let t=e.reduce((e,t)=>e+t.source,"");return RegExp(`^${t}$`)}function combineExtractors(...e){return t=>e.reduce(([e,r,n],a)=>{let[i,o,s]=a(t,n);return[{...e,...i},o||r,s]},[{},null,1]).slice(0,2)}function parse(e,...t){if(null==e)return[null,null];for(let[r,n]of t){let t=r.exec(e);if(t)return n(t)}return[null,null]}function simpleParse(...e){return(t,r)=>{let n;let a={};for(n=0;n<e.length;n++)a[e[n]]=parseInteger(t[r+n]);return[a,null,r+n]}}let ep=/(?:([Zz])|([+-]\d\d)(?::?(\d\d))?)/,ey=`(?:${ep.source}?(?:\\[(${ec.source})\\])?)?`,em=/(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/,eh=RegExp(`${em.source}${ey}`),ef=RegExp(`(?:[Tt]${eh.source})?`),eb=simpleParse("weekYear","weekNumber","weekDay"),eK=simpleParse("year","ordinal"),eg=RegExp(`${em.source} ?(?:${ep.source}|(${ec.source}))?`),ev=RegExp(`(?: ${eg.source})?`);function int(e,t,r){let n=e[t];return isUndefined(n)?r:parseInteger(n)}function extractISOTime(e,t){let r={hours:int(e,t,0),minutes:int(e,t+1,0),seconds:int(e,t+2,0),milliseconds:parseMillis(e[t+3])};return[r,null,t+4]}function extractISOOffset(e,t){let r=!e[t]&&!e[t+1],n=signedOffset(e[t+1],e[t+2]),a=r?null:FixedOffsetZone.instance(n);return[{},a,t+3]}function extractIANAZone(e,t){let r=e[t]?IANAZone.create(e[t]):null;return[{},r,t+1]}let eI=RegExp(`^T?${em.source}$`),eE=/^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;function extractISODuration(e){let[t,r,n,a,i,o,s,l,d]=e,u="-"===t[0],c=l&&"-"===l[0],maybeNegate=(e,t=!1)=>void 0!==e&&(t||e&&u)?-e:e;return[{years:maybeNegate(parseFloating(r)),months:maybeNegate(parseFloating(n)),weeks:maybeNegate(parseFloating(a)),days:maybeNegate(parseFloating(i)),hours:maybeNegate(parseFloating(o)),minutes:maybeNegate(parseFloating(s)),seconds:maybeNegate(parseFloating(l),"-0"===l),milliseconds:maybeNegate(parseMillis(d),c)}]}let eS={GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function fromStrings(e,t,r,n,a,i,o){let s={year:2===t.length?untruncateYear(parseInteger(t)):parseInteger(t),month:et.indexOf(r)+1,day:parseInteger(n),hour:parseInteger(a),minute:parseInteger(i)};return o&&(s.second=parseInteger(o)),e&&(s.weekday=e.length>3?en.indexOf(e)+1:ea.indexOf(e)+1),s}let ej=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;function extractRFC2822(e){let t;let[,r,n,a,i,o,s,l,d,u,c,p]=e,y=fromStrings(r,i,a,n,o,s,l);return t=d?eS[d]:u?0:signedOffset(c,p),[y,new FixedOffsetZone(t)]}let ek=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,ex=/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,ew=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;function extractRFC1123Or850(e){let[,t,r,n,a,i,o,s]=e,l=fromStrings(t,a,n,r,i,o,s);return[l,FixedOffsetZone.utcInstance]}function extractASCII(e){let[,t,r,n,a,i,o,s]=e,l=fromStrings(t,s,r,n,a,i,o);return[l,FixedOffsetZone.utcInstance]}let eT=combineRegexes(/([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/,ef),eD=combineRegexes(/(\d{4})-?W(\d\d)(?:-?(\d))?/,ef),eO=combineRegexes(/(\d{4})-?(\d{3})/,ef),eA=combineRegexes(eh),eR=combineExtractors(function(e,t){let r={year:int(e,t),month:int(e,t+1,1),day:int(e,t+2,1)};return[r,null,t+3]},extractISOTime,extractISOOffset,extractIANAZone),eP=combineExtractors(eb,extractISOTime,extractISOOffset,extractIANAZone),eC=combineExtractors(eK,extractISOTime,extractISOOffset,extractIANAZone),eM=combineExtractors(extractISOTime,extractISOOffset,extractIANAZone),e_=combineExtractors(extractISOTime),eJ=combineRegexes(/(\d{4})-(\d\d)-(\d\d)/,ev),eL=combineRegexes(eg),eN=combineExtractors(extractISOTime,extractISOOffset,extractIANAZone),eF="Invalid Duration",eV={weeks:{days:7,hours:168,minutes:10080,seconds:604800,milliseconds:6048e5},days:{hours:24,minutes:1440,seconds:86400,milliseconds:864e5},hours:{minutes:60,seconds:3600,milliseconds:36e5},minutes:{seconds:60,milliseconds:6e4},seconds:{milliseconds:1e3}},eq={years:{quarters:4,months:12,weeks:52,days:365,hours:8760,minutes:525600,seconds:31536e3,milliseconds:31536e6},quarters:{months:3,weeks:13,days:91,hours:2184,minutes:131040,seconds:7862400,milliseconds:78624e5},months:{weeks:4,days:30,hours:720,minutes:43200,seconds:2592e3,milliseconds:2592e6},...eV},eG={years:{quarters:4,months:12,weeks:52.1775,days:365.2425,hours:8765.82,minutes:525949.2,seconds:31556952,milliseconds:31556952e3},quarters:{months:3,weeks:13.044375,days:91.310625,hours:2191.455,minutes:131487.3,seconds:7889238,milliseconds:7889238e3},months:{weeks:30.436875/7,days:30.436875,hours:730.485,minutes:43829.1,seconds:2629746,milliseconds:2629746e3},...eV},eY=["years","quarters","months","weeks","days","hours","minutes","seconds","milliseconds"],eW=eY.slice(0).reverse();function clone$1(e,t,r=!1){let n={values:r?t.values:{...e.values,...t.values||{}},loc:e.loc.clone(t.loc),conversionAccuracy:t.conversionAccuracy||e.conversionAccuracy,matrix:t.matrix||e.matrix};return new Duration(n)}function durationToMillis(e,t){var r;let n=null!=(r=t.milliseconds)?r:0;for(let r of eW.slice(1))t[r]&&(n+=t[r]*e[r].milliseconds);return n}function normalizeValues(e,t){let r=0>durationToMillis(e,t)?-1:1;eY.reduceRight((n,a)=>{if(isUndefined(t[a]))return n;if(n){let i=t[n]*r,o=e[a][n],s=Math.floor(i/o);t[a]+=s*r,t[n]-=s*o*r}return a},null),eY.reduce((r,n)=>{if(isUndefined(t[n]))return r;if(r){let a=t[r]%1;t[r]-=a,t[n]+=a*e[r][n]}return n},null)}function removeZeroes(e){let t={};for(let[r,n]of Object.entries(e))0!==n&&(t[r]=n);return t}let Duration=class Duration{constructor(e){let t="longterm"===e.conversionAccuracy,r=t?eG:eq;e.matrix&&(r=e.matrix),this.values=e.values,this.loc=e.loc||Locale.create(),this.conversionAccuracy=t?"longterm":"casual",this.invalid=e.invalid||null,this.matrix=r,this.isLuxonDuration=!0}static fromMillis(e,t){return Duration.fromObject({milliseconds:e},t)}static fromObject(e,t={}){if(null==e||"object"!=typeof e)throw new InvalidArgumentError(`Duration.fromObject: argument expected to be an object, got ${null===e?"null":typeof e}`);return new Duration({values:normalizeObject(e,Duration.normalizeUnit),loc:Locale.fromObject(t),conversionAccuracy:t.conversionAccuracy,matrix:t.matrix})}static fromDurationLike(e){if(isNumber(e))return Duration.fromMillis(e);if(Duration.isDuration(e))return e;if("object"==typeof e)return Duration.fromObject(e);throw new InvalidArgumentError(`Unknown duration argument ${e} of type ${typeof e}`)}static fromISO(e,t){let[r]=parse(e,[eE,extractISODuration]);return r?Duration.fromObject(r,t):Duration.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static fromISOTime(e,t){let[r]=parse(e,[eI,e_]);return r?Duration.fromObject(r,t):Duration.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static invalid(e,t=null){if(!e)throw new InvalidArgumentError("need to specify a reason the Duration is invalid");let r=e instanceof Invalid?e:new Invalid(e,t);if(!Settings.throwOnInvalid)return new Duration({invalid:r});throw new InvalidDurationError(r)}static normalizeUnit(e){let t={year:"years",years:"years",quarter:"quarters",quarters:"quarters",month:"months",months:"months",week:"weeks",weeks:"weeks",day:"days",days:"days",hour:"hours",hours:"hours",minute:"minutes",minutes:"minutes",second:"seconds",seconds:"seconds",millisecond:"milliseconds",milliseconds:"milliseconds"}[e?e.toLowerCase():e];if(!t)throw new InvalidUnitError(e);return t}static isDuration(e){return e&&e.isLuxonDuration||!1}get locale(){return this.isValid?this.loc.locale:null}get numberingSystem(){return this.isValid?this.loc.numberingSystem:null}toFormat(e,t={}){let r={...t,floor:!1!==t.round&&!1!==t.floor};return this.isValid?Formatter.create(this.loc,r).formatDurationFromString(this,e):eF}toHuman(e={}){if(!this.isValid)return eF;let t=!1!==e.showZeros,r=eY.map(r=>{let n=this.values[r];return isUndefined(n)||0===n&&!t?null:this.loc.numberFormatter({style:"unit",unitDisplay:"long",...e,unit:r.slice(0,-1)}).format(n)}).filter(e=>e);return this.loc.listFormatter({type:"conjunction",style:e.listStyle||"narrow",...e}).format(r)}toObject(){return this.isValid?{...this.values}:{}}toISO(){if(!this.isValid)return null;let e="P";return 0!==this.years&&(e+=this.years+"Y"),(0!==this.months||0!==this.quarters)&&(e+=this.months+3*this.quarters+"M"),0!==this.weeks&&(e+=this.weeks+"W"),0!==this.days&&(e+=this.days+"D"),(0!==this.hours||0!==this.minutes||0!==this.seconds||0!==this.milliseconds)&&(e+="T"),0!==this.hours&&(e+=this.hours+"H"),0!==this.minutes&&(e+=this.minutes+"M"),(0!==this.seconds||0!==this.milliseconds)&&(e+=roundTo(this.seconds+this.milliseconds/1e3,3)+"S"),"P"===e&&(e+="T0S"),e}toISOTime(e={}){if(!this.isValid)return null;let t=this.toMillis();if(t<0||t>=864e5)return null;e={suppressMilliseconds:!1,suppressSeconds:!1,includePrefix:!1,format:"extended",...e,includeOffset:!1};let r=DateTime.fromMillis(t,{zone:"UTC"});return r.toISOTime(e)}toJSON(){return this.toISO()}toString(){return this.toISO()}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`Duration { values: ${JSON.stringify(this.values)} }`:`Duration { Invalid, reason: ${this.invalidReason} }`}toMillis(){return this.isValid?durationToMillis(this.matrix,this.values):NaN}valueOf(){return this.toMillis()}plus(e){if(!this.isValid)return this;let t=Duration.fromDurationLike(e),r={};for(let e of eY)(hasOwnProperty(t.values,e)||hasOwnProperty(this.values,e))&&(r[e]=t.get(e)+this.get(e));return clone$1(this,{values:r},!0)}minus(e){if(!this.isValid)return this;let t=Duration.fromDurationLike(e);return this.plus(t.negate())}mapUnits(e){if(!this.isValid)return this;let t={};for(let r of Object.keys(this.values))t[r]=asNumber(e(this.values[r],r));return clone$1(this,{values:t},!0)}get(e){return this[Duration.normalizeUnit(e)]}set(e){if(!this.isValid)return this;let t={...this.values,...normalizeObject(e,Duration.normalizeUnit)};return clone$1(this,{values:t})}reconfigure({locale:e,numberingSystem:t,conversionAccuracy:r,matrix:n}={}){let a=this.loc.clone({locale:e,numberingSystem:t});return clone$1(this,{loc:a,matrix:n,conversionAccuracy:r})}as(e){return this.isValid?this.shiftTo(e).get(e):NaN}normalize(){if(!this.isValid)return this;let e=this.toObject();return normalizeValues(this.matrix,e),clone$1(this,{values:e},!0)}rescale(){if(!this.isValid)return this;let e=removeZeroes(this.normalize().shiftToAll().toObject());return clone$1(this,{values:e},!0)}shiftTo(...e){let t;if(!this.isValid||0===e.length)return this;e=e.map(e=>Duration.normalizeUnit(e));let r={},n={},a=this.toObject();for(let i of eY)if(e.indexOf(i)>=0){t=i;let e=0;for(let t in n)e+=this.matrix[t][i]*n[t],n[t]=0;isNumber(a[i])&&(e+=a[i]);let o=Math.trunc(e);r[i]=o,n[i]=(1e3*e-1e3*o)/1e3}else isNumber(a[i])&&(n[i]=a[i]);for(let e in n)0!==n[e]&&(r[t]+=e===t?n[e]:n[e]/this.matrix[t][e]);return normalizeValues(this.matrix,r),clone$1(this,{values:r},!0)}shiftToAll(){return this.isValid?this.shiftTo("years","months","weeks","days","hours","minutes","seconds","milliseconds"):this}negate(){if(!this.isValid)return this;let e={};for(let t of Object.keys(this.values))e[t]=0===this.values[t]?0:-this.values[t];return clone$1(this,{values:e},!0)}removeZeros(){if(!this.isValid)return this;let e=removeZeroes(this.values);return clone$1(this,{values:e},!0)}get years(){return this.isValid?this.values.years||0:NaN}get quarters(){return this.isValid?this.values.quarters||0:NaN}get months(){return this.isValid?this.values.months||0:NaN}get weeks(){return this.isValid?this.values.weeks||0:NaN}get days(){return this.isValid?this.values.days||0:NaN}get hours(){return this.isValid?this.values.hours||0:NaN}get minutes(){return this.isValid?this.values.minutes||0:NaN}get seconds(){return this.isValid?this.values.seconds||0:NaN}get milliseconds(){return this.isValid?this.values.milliseconds||0:NaN}get isValid(){return null===this.invalid}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}equals(e){if(!this.isValid||!e.isValid||!this.loc.equals(e.loc))return!1;for(let n of eY){var t,r;if(t=this.values[n],r=e.values[n],void 0===t||0===t?void 0!==r&&0!==r:t!==r)return!1}return!0}};let eU="Invalid Interval";let Interval=class Interval{constructor(e){this.s=e.start,this.e=e.end,this.invalid=e.invalid||null,this.isLuxonInterval=!0}static invalid(e,t=null){if(!e)throw new InvalidArgumentError("need to specify a reason the Interval is invalid");let r=e instanceof Invalid?e:new Invalid(e,t);if(!Settings.throwOnInvalid)return new Interval({invalid:r});throw new InvalidIntervalError(r)}static fromDateTimes(e,t){let r=friendlyDateTime(e),n=friendlyDateTime(t),a=r&&r.isValid?n&&n.isValid?n<r?Interval.invalid("end before start",`The end of an interval must be after its start, but you had start=${r.toISO()} and end=${n.toISO()}`):null:Interval.invalid("missing or invalid end"):Interval.invalid("missing or invalid start");return null==a?new Interval({start:r,end:n}):a}static after(e,t){let r=Duration.fromDurationLike(t),n=friendlyDateTime(e);return Interval.fromDateTimes(n,n.plus(r))}static before(e,t){let r=Duration.fromDurationLike(t),n=friendlyDateTime(e);return Interval.fromDateTimes(n.minus(r),n)}static fromISO(e,t){let[r,n]=(e||"").split("/",2);if(r&&n){let e,a,i,o;try{a=(e=DateTime.fromISO(r,t)).isValid}catch(e){a=!1}try{o=(i=DateTime.fromISO(n,t)).isValid}catch(e){o=!1}if(a&&o)return Interval.fromDateTimes(e,i);if(a){let r=Duration.fromISO(n,t);if(r.isValid)return Interval.after(e,r)}else if(o){let e=Duration.fromISO(r,t);if(e.isValid)return Interval.before(i,e)}}return Interval.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static isInterval(e){return e&&e.isLuxonInterval||!1}get start(){return this.isValid?this.s:null}get end(){return this.isValid?this.e:null}get lastDateTime(){return this.isValid&&this.e?this.e.minus(1):null}get isValid(){return null===this.invalidReason}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}length(e="milliseconds"){return this.isValid?this.toDuration(...[e]).get(e):NaN}count(e="milliseconds",t){let r;if(!this.isValid)return NaN;let n=this.start.startOf(e,t);return Math.floor((r=(r=null!=t&&t.useLocaleWeeks?this.end.reconfigure({locale:n.locale}):this.end).startOf(e,t)).diff(n,e).get(e))+(r.valueOf()!==this.end.valueOf())}hasSame(e){return!!this.isValid&&(this.isEmpty()||this.e.minus(1).hasSame(this.s,e))}isEmpty(){return this.s.valueOf()===this.e.valueOf()}isAfter(e){return!!this.isValid&&this.s>e}isBefore(e){return!!this.isValid&&this.e<=e}contains(e){return!!this.isValid&&this.s<=e&&this.e>e}set({start:e,end:t}={}){return this.isValid?Interval.fromDateTimes(e||this.s,t||this.e):this}splitAt(...e){if(!this.isValid)return[];let t=e.map(friendlyDateTime).filter(e=>this.contains(e)).sort((e,t)=>e.toMillis()-t.toMillis()),r=[],{s:n}=this,a=0;for(;n<this.e;){let e=t[a]||this.e,i=+e>+this.e?this.e:e;r.push(Interval.fromDateTimes(n,i)),n=i,a+=1}return r}splitBy(e){let t=Duration.fromDurationLike(e);if(!this.isValid||!t.isValid||0===t.as("milliseconds"))return[];let{s:r}=this,n=1,a,i=[];for(;r<this.e;){let e=this.start.plus(t.mapUnits(e=>e*n));a=+e>+this.e?this.e:e,i.push(Interval.fromDateTimes(r,a)),r=a,n+=1}return i}divideEqually(e){return this.isValid?this.splitBy(this.length()/e).slice(0,e):[]}overlaps(e){return this.e>e.s&&this.s<e.e}abutsStart(e){return!!this.isValid&&+this.e==+e.s}abutsEnd(e){return!!this.isValid&&+e.e==+this.s}engulfs(e){return!!this.isValid&&this.s<=e.s&&this.e>=e.e}equals(e){return!!this.isValid&&!!e.isValid&&this.s.equals(e.s)&&this.e.equals(e.e)}intersection(e){if(!this.isValid)return this;let t=this.s>e.s?this.s:e.s,r=this.e<e.e?this.e:e.e;return t>=r?null:Interval.fromDateTimes(t,r)}union(e){if(!this.isValid)return this;let t=this.s<e.s?this.s:e.s,r=this.e>e.e?this.e:e.e;return Interval.fromDateTimes(t,r)}static merge(e){let[t,r]=e.sort((e,t)=>e.s-t.s).reduce(([e,t],r)=>t?t.overlaps(r)||t.abutsStart(r)?[e,t.union(r)]:[e.concat([t]),r]:[e,r],[[],null]);return r&&t.push(r),t}static xor(e){let t=null,r=0,n=[],a=e.map(e=>[{time:e.s,type:"s"},{time:e.e,type:"e"}]),i=Array.prototype.concat(...a),o=i.sort((e,t)=>e.time-t.time);for(let e of o)1===(r+="s"===e.type?1:-1)?t=e.time:(t&&+t!=+e.time&&n.push(Interval.fromDateTimes(t,e.time)),t=null);return Interval.merge(n)}difference(...e){return Interval.xor([this].concat(e)).map(e=>this.intersection(e)).filter(e=>e&&!e.isEmpty())}toString(){return this.isValid?`[${this.s.toISO()} – ${this.e.toISO()})`:eU}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`:`Interval { Invalid, reason: ${this.invalidReason} }`}toLocaleString(e=o,t={}){return this.isValid?Formatter.create(this.s.loc.clone(t),e).formatInterval(this):eU}toISO(e){return this.isValid?`${this.s.toISO(e)}/${this.e.toISO(e)}`:eU}toISODate(){return this.isValid?`${this.s.toISODate()}/${this.e.toISODate()}`:eU}toISOTime(e){return this.isValid?`${this.s.toISOTime(e)}/${this.e.toISOTime(e)}`:eU}toFormat(e,{separator:t=" – "}={}){return this.isValid?`${this.s.toFormat(e)}${t}${this.e.toFormat(e)}`:eU}toDuration(e,t){return this.isValid?this.e.diff(this.s,e,t):Duration.invalid(this.invalidReason)}mapEndpoints(e){return Interval.fromDateTimes(e(this.s),e(this.e))}};let Info=class Info{static hasDST(e=Settings.defaultZone){let t=DateTime.now().setZone(e).set({month:12});return!e.isUniversal&&t.offset!==t.set({month:6}).offset}static isValidIANAZone(e){return IANAZone.isValidZone(e)}static normalizeZone(e){return normalizeZone(e,Settings.defaultZone)}static getStartOfWeek({locale:e=null,locObj:t=null}={}){return(t||Locale.create(e)).getStartOfWeek()}static getMinimumDaysInFirstWeek({locale:e=null,locObj:t=null}={}){return(t||Locale.create(e)).getMinDaysInFirstWeek()}static getWeekendWeekdays({locale:e=null,locObj:t=null}={}){return(t||Locale.create(e)).getWeekendDays().slice()}static months(e="long",{locale:t=null,numberingSystem:r=null,locObj:n=null,outputCalendar:a="gregory"}={}){return(n||Locale.create(t,r,a)).months(e)}static monthsFormat(e="long",{locale:t=null,numberingSystem:r=null,locObj:n=null,outputCalendar:a="gregory"}={}){return(n||Locale.create(t,r,a)).months(e,!0)}static weekdays(e="long",{locale:t=null,numberingSystem:r=null,locObj:n=null}={}){return(n||Locale.create(t,r,null)).weekdays(e)}static weekdaysFormat(e="long",{locale:t=null,numberingSystem:r=null,locObj:n=null}={}){return(n||Locale.create(t,r,null)).weekdays(e,!0)}static meridiems({locale:e=null}={}){return Locale.create(e).meridiems()}static eras(e="short",{locale:t=null}={}){return Locale.create(t,null,"gregory").eras(e)}static features(){return{relative:hasRelative(),localeWeek:hasLocaleWeekInfo()}}};function dayDiff(e,t){let utcDayStart=e=>e.toUTC(0,{keepLocalTime:!0}).startOf("day").valueOf(),r=utcDayStart(t)-utcDayStart(e);return Math.floor(Duration.fromMillis(r).as("days"))}function intUnit(e,t=e=>e){return{regex:e,deser:([e])=>t(function(e){let t=parseInt(e,10);if(!isNaN(t))return t;t="";for(let r=0;r<e.length;r++){let n=e.charCodeAt(r);if(-1!==e[r].search(V.hanidec))t+=G.indexOf(e[r]);else for(let e in q){let[r,a]=q[e];n>=r&&n<=a&&(t+=n-r)}}return parseInt(t,10)}(e))}}let e$=String.fromCharCode(160),eZ=`[ ${e$}]`,ez=RegExp(eZ,"g");function fixListRegex(e){return e.replace(/\./g,"\\.?").replace(ez,eZ)}function stripInsensitivities(e){return e.replace(/\./g,"").replace(ez," ").toLowerCase()}function oneOf(e,t){return null===e?null:{regex:RegExp(e.map(fixListRegex).join("|")),deser:([r])=>e.findIndex(e=>stripInsensitivities(r)===stripInsensitivities(e))+t}}function offset(e,t){return{regex:e,deser:([,e,t])=>signedOffset(e,t),groups:t}}function simple(e){return{regex:e,deser:([e])=>e}}let eH={year:{"2-digit":"yy",numeric:"yyyyy"},month:{numeric:"M","2-digit":"MM",short:"MMM",long:"MMMM"},day:{numeric:"d","2-digit":"dd"},weekday:{short:"EEE",long:"EEEE"},dayperiod:"a",dayPeriod:"a",hour12:{numeric:"h","2-digit":"hh"},hour24:{numeric:"H","2-digit":"HH"},minute:{numeric:"m","2-digit":"mm"},second:{numeric:"s","2-digit":"ss"},timeZoneName:{long:"ZZZZZ",short:"ZZZ"}},eB=null;function expandMacroTokens(e,t){return Array.prototype.concat(...e.map(e=>(function(e,t){if(e.literal)return e;let r=Formatter.macroTokenToFormatOpts(e.val),n=formatOptsToTokens(r,t);return null==n||n.includes(void 0)?e:n})(e,t)))}let TokenParser=class TokenParser{constructor(e,t){if(this.locale=e,this.format=t,this.tokens=expandMacroTokens(Formatter.parseFormat(t),e),this.units=this.tokens.map(t=>(function(e,t){let r=digitRegex(t),n=digitRegex(t,"{2}"),a=digitRegex(t,"{3}"),i=digitRegex(t,"{4}"),o=digitRegex(t,"{6}"),s=digitRegex(t,"{1,2}"),l=digitRegex(t,"{1,3}"),d=digitRegex(t,"{1,6}"),u=digitRegex(t,"{1,9}"),c=digitRegex(t,"{2,4}"),p=digitRegex(t,"{4,6}"),literal=e=>({regex:RegExp(e.val.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")),deser:([e])=>e,literal:!0}),y=(y=>{if(e.literal)return literal(y);switch(y.val){case"G":return oneOf(t.eras("short"),0);case"GG":return oneOf(t.eras("long"),0);case"y":return intUnit(d);case"yy":case"kk":return intUnit(c,untruncateYear);case"yyyy":case"kkkk":return intUnit(i);case"yyyyy":return intUnit(p);case"yyyyyy":return intUnit(o);case"M":case"L":case"d":case"H":case"h":case"m":case"q":case"s":case"W":return intUnit(s);case"MM":case"LL":case"dd":case"HH":case"hh":case"mm":case"qq":case"ss":case"WW":return intUnit(n);case"MMM":return oneOf(t.months("short",!0),1);case"MMMM":return oneOf(t.months("long",!0),1);case"LLL":return oneOf(t.months("short",!1),1);case"LLLL":return oneOf(t.months("long",!1),1);case"o":case"S":return intUnit(l);case"ooo":case"SSS":return intUnit(a);case"u":return simple(u);case"uu":return simple(s);case"uuu":case"E":case"c":return intUnit(r);case"a":return oneOf(t.meridiems(),0);case"EEE":return oneOf(t.weekdays("short",!1),1);case"EEEE":return oneOf(t.weekdays("long",!1),1);case"ccc":return oneOf(t.weekdays("short",!0),1);case"cccc":return oneOf(t.weekdays("long",!0),1);case"Z":case"ZZ":return offset(RegExp(`([+-]${s.source})(?::(${n.source}))?`),2);case"ZZZ":return offset(RegExp(`([+-]${s.source})(${n.source})?`),2);case"z":return simple(/[a-z_+-/]{1,256}?/i);case" ":return simple(/[^\S\n\r]/);default:return literal(y)}})(e)||{invalidReason:"missing Intl.DateTimeFormat.formatToParts support"};return y.token=e,y})(t,e)),this.disqualifyingUnit=this.units.find(e=>e.invalidReason),!this.disqualifyingUnit){let[e,t]=function(e){let t=e.map(e=>e.regex).reduce((e,t)=>`${e}(${t.source})`,"");return[`^${t}$`,e]}(this.units);this.regex=RegExp(e,"i"),this.handlers=t}}explainFromTokens(e){if(!this.isValid)return{input:e,tokens:this.tokens,invalidReason:this.invalidReason};{let[t,r]=function(e,t,r){let n=e.match(t);if(!n)return[n,{}];{let e={},t=1;for(let a in r)if(hasOwnProperty(r,a)){let i=r[a],o=i.groups?i.groups+1:1;!i.literal&&i.token&&(e[i.token.val[0]]=i.deser(n.slice(t,t+o))),t+=o}return[n,e]}}(e,this.regex,this.handlers),[n,a,i]=r?function(e){let t;let toField=e=>{switch(e){case"S":return"millisecond";case"s":return"second";case"m":return"minute";case"h":case"H":return"hour";case"d":return"day";case"o":return"ordinal";case"L":case"M":return"month";case"y":return"year";case"E":case"c":return"weekday";case"W":return"weekNumber";case"k":return"weekYear";case"q":return"quarter";default:return null}},r=null;isUndefined(e.z)||(r=IANAZone.create(e.z)),isUndefined(e.Z)||(r||(r=new FixedOffsetZone(e.Z)),t=e.Z),isUndefined(e.q)||(e.M=(e.q-1)*3+1),isUndefined(e.h)||(e.h<12&&1===e.a?e.h+=12:12!==e.h||0!==e.a||(e.h=0)),0===e.G&&e.y&&(e.y=-e.y),isUndefined(e.u)||(e.S=parseMillis(e.u));let n=Object.keys(e).reduce((t,r)=>{let n=toField(r);return n&&(t[n]=e[r]),t},{});return[n,r,t]}(r):[null,null,void 0];if(hasOwnProperty(r,"a")&&hasOwnProperty(r,"H"))throw new ConflictingSpecificationError("Can't include meridiem when specifying 24-hour format");return{input:e,tokens:this.tokens,regex:this.regex,rawMatches:t,matches:r,result:n,zone:a,specificOffset:i}}}get isValid(){return!this.disqualifyingUnit}get invalidReason(){return this.disqualifyingUnit?this.disqualifyingUnit.invalidReason:null}};function explainFromTokens(e,t,r){let n=new TokenParser(e,r);return n.explainFromTokens(t)}function formatOptsToTokens(e,t){if(!e)return null;let r=Formatter.create(t,e),n=r.dtFormatter((eB||(eB=DateTime.fromMillis(1555555555555)),eB)),a=n.formatToParts(),i=n.resolvedOptions();return a.map(t=>(function(e,t,r){let{type:n,value:a}=e;if("literal"===n){let e=/^\s+$/.test(a);return{literal:!e,val:e?" ":a}}let i=t[n],o=n;"hour"===n&&(o=null!=t.hour12?t.hour12?"hour12":"hour24":null!=t.hourCycle?"h11"===t.hourCycle||"h12"===t.hourCycle?"hour12":"hour24":r.hour12?"hour12":"hour24");let s=eH[o];if("object"==typeof s&&(s=s[i]),s)return{literal:!1,val:s}})(t,e,i))}let eX="Invalid DateTime";function unsupportedZone(e){return new Invalid("unsupported zone",`the zone "${e.name}" is not supported`)}function possiblyCachedWeekData(e){return null===e.weekData&&(e.weekData=gregorianToWeek(e.c)),e.weekData}function possiblyCachedLocalWeekData(e){return null===e.localWeekData&&(e.localWeekData=gregorianToWeek(e.c,e.loc.getMinDaysInFirstWeek(),e.loc.getStartOfWeek())),e.localWeekData}function clone(e,t){let r={ts:e.ts,zone:e.zone,c:e.c,o:e.o,loc:e.loc,invalid:e.invalid};return new DateTime({...r,...t,old:r})}function fixOffset(e,t,r){let n=e-6e4*t,a=r.offset(n);if(t===a)return[n,t];n-=(a-t)*6e4;let i=r.offset(n);return a===i?[n,a]:[e-6e4*Math.min(a,i),Math.max(a,i)]}function tsToObj(e,t){e+=6e4*t;let r=new Date(e);return{year:r.getUTCFullYear(),month:r.getUTCMonth()+1,day:r.getUTCDate(),hour:r.getUTCHours(),minute:r.getUTCMinutes(),second:r.getUTCSeconds(),millisecond:r.getUTCMilliseconds()}}function adjustTime(e,t){let r=e.o,n=e.c.year+Math.trunc(t.years),a=e.c.month+Math.trunc(t.months)+3*Math.trunc(t.quarters),i={...e.c,year:n,month:a,day:Math.min(e.c.day,daysInMonth(n,a))+Math.trunc(t.days)+7*Math.trunc(t.weeks)},o=Duration.fromObject({years:t.years-Math.trunc(t.years),quarters:t.quarters-Math.trunc(t.quarters),months:t.months-Math.trunc(t.months),weeks:t.weeks-Math.trunc(t.weeks),days:t.days-Math.trunc(t.days),hours:t.hours,minutes:t.minutes,seconds:t.seconds,milliseconds:t.milliseconds}).as("milliseconds"),s=objToLocalTS(i),[l,d]=fixOffset(s,r,e.zone);return 0!==o&&(l+=o,d=e.zone.offset(l)),{ts:l,o:d}}function parseDataToDateTime(e,t,r,n,a,i){let{setZone:o,zone:s}=r;if((!e||0===Object.keys(e).length)&&!t)return DateTime.invalid(new Invalid("unparsable",`the input "${a}" can't be parsed as ${n}`));{let n=t||s,a=DateTime.fromObject(e,{...r,zone:n,specificOffset:i});return o?a:a.setZone(s)}}function toTechFormat(e,t,r=!0){return e.isValid?Formatter.create(Locale.create("en-US"),{allowZ:r,forceSimple:!0}).formatDateTimeFromString(e,t):null}function toISODate(e,t,r){let n=e.c.year>9999||e.c.year<0,a="";if(n&&e.c.year>=0&&(a+="+"),a+=padStart(e.c.year,n?6:4),"year"===r)return a;if(t){if(a+="-"+padStart(e.c.month),"month"===r)return a;a+="-"}else if(a+=padStart(e.c.month),"month"===r)return a;return a+padStart(e.c.day)}function toISOTime(e,t,r,n,a,i,o){let s=!r||0!==e.c.millisecond||0!==e.c.second,l="";switch(o){case"day":case"month":case"year":break;default:if(l+=padStart(e.c.hour),"hour"===o)break;if(t){if(l+=":"+padStart(e.c.minute),"minute"===o)break;s&&(l+=":"+padStart(e.c.second))}else{if(l+=padStart(e.c.minute),"minute"===o)break;s&&(l+=padStart(e.c.second))}if("second"===o)break;s&&(!n||0!==e.c.millisecond)&&(l+="."+padStart(e.c.millisecond,3))}return a&&(e.isOffsetFixed&&0===e.offset&&!i?l+="Z":e.o<0?l+="-"+padStart(Math.trunc(-e.o/60))+":"+padStart(Math.trunc(-e.o%60)):l+="+"+padStart(Math.trunc(e.o/60))+":"+padStart(Math.trunc(e.o%60))),i&&(l+="["+e.zone.ianaName+"]"),l}let eQ={month:1,day:1,hour:0,minute:0,second:0,millisecond:0},e0={weekNumber:1,weekday:1,hour:0,minute:0,second:0,millisecond:0},e1={ordinal:1,hour:0,minute:0,second:0,millisecond:0},e2=["year","month","day","hour","minute","second","millisecond"],e4=["weekYear","weekNumber","weekday","hour","minute","second","millisecond"],e3=["year","ordinal","hour","minute","second","millisecond"];function normalizeUnit(e){let t={year:"year",years:"year",month:"month",months:"month",day:"day",days:"day",hour:"hour",hours:"hour",minute:"minute",minutes:"minute",quarter:"quarter",quarters:"quarter",second:"second",seconds:"second",millisecond:"millisecond",milliseconds:"millisecond",weekday:"weekday",weekdays:"weekday",weeknumber:"weekNumber",weeksnumber:"weekNumber",weeknumbers:"weekNumber",weekyear:"weekYear",weekyears:"weekYear",ordinal:"ordinal"}[e.toLowerCase()];if(!t)throw new InvalidUnitError(e);return t}function normalizeUnitWithLocalWeeks(e){switch(e.toLowerCase()){case"localweekday":case"localweekdays":return"localWeekday";case"localweeknumber":case"localweeknumbers":return"localWeekNumber";case"localweekyear":case"localweekyears":return"localWeekYear";default:return normalizeUnit(e)}}function quickDT(e,t){let n,a;let i=normalizeZone(t.zone,Settings.defaultZone);if(!i.isValid)return DateTime.invalid(unsupportedZone(i));let o=Locale.fromObject(t);if(isUndefined(e.year))n=Settings.now();else{for(let t of e2)isUndefined(e[t])&&(e[t]=eQ[t]);let t=hasInvalidGregorianData(e)||hasInvalidTimeData(e);if(t)return DateTime.invalid(t);let o=function(e){if(void 0===r&&(r=Settings.now()),"iana"!==e.type)return e.offset(r);let t=e.name,n=e6.get(t);return void 0===n&&(n=e.offset(r),e6.set(t,n)),n}(i);[n,a]=fixOffset(objToLocalTS(e),o,i)}return new DateTime({ts:n,zone:i,loc:o,o:a})}function diffRelative(e,t,r){let n=!!isUndefined(r.round)||r.round,a=isUndefined(r.rounding)?"trunc":r.rounding,format=(e,i)=>{e=roundTo(e,n||r.calendary?0:2,r.calendary?"round":a);let o=t.loc.clone(r).relFormatter(r);return o.format(e,i)},differ=n=>r.calendary?t.hasSame(e,n)?0:t.startOf(n).diff(e.startOf(n),n).get(n):t.diff(e,n).get(n);if(r.unit)return format(differ(r.unit),r.unit);for(let e of r.units){let t=differ(e);if(Math.abs(t)>=1)return format(t,e)}return format(e>t?-0:0,r.units[r.units.length-1])}function lastOpts(e){let t={},r;return e.length>0&&"object"==typeof e[e.length-1]?(t=e[e.length-1],r=Array.from(e).slice(0,e.length-1)):r=Array.from(e),[t,r]}let e6=new Map;let DateTime=class DateTime{constructor(e){let t=e.zone||Settings.defaultZone,r=e.invalid||(Number.isNaN(e.ts)?new Invalid("invalid input"):null)||(t.isValid?null:unsupportedZone(t));this.ts=isUndefined(e.ts)?Settings.now():e.ts;let n=null,a=null;if(!r){let i=e.old&&e.old.ts===this.ts&&e.old.zone.equals(t);if(i)[n,a]=[e.old.c,e.old.o];else{let i=isNumber(e.o)&&!e.old?e.o:t.offset(this.ts);n=(r=Number.isNaN((n=tsToObj(this.ts,i)).year)?new Invalid("invalid input"):null)?null:n,a=r?null:i}}this._zone=t,this.loc=e.loc||Locale.create(),this.invalid=r,this.weekData=null,this.localWeekData=null,this.c=n,this.o=a,this.isLuxonDateTime=!0}static now(){return new DateTime({})}static local(){let[e,t]=lastOpts(arguments),[r,n,a,i,o,s,l]=t;return quickDT({year:r,month:n,day:a,hour:i,minute:o,second:s,millisecond:l},e)}static utc(){let[e,t]=lastOpts(arguments),[r,n,a,i,o,s,l]=t;return e.zone=FixedOffsetZone.utcInstance,quickDT({year:r,month:n,day:a,hour:i,minute:o,second:s,millisecond:l},e)}static fromJSDate(e,t={}){let r="[object Date]"===Object.prototype.toString.call(e)?e.valueOf():NaN;if(Number.isNaN(r))return DateTime.invalid("invalid input");let n=normalizeZone(t.zone,Settings.defaultZone);return n.isValid?new DateTime({ts:r,zone:n,loc:Locale.fromObject(t)}):DateTime.invalid(unsupportedZone(n))}static fromMillis(e,t={}){if(isNumber(e))return e<-864e13||e>864e13?DateTime.invalid("Timestamp out of range"):new DateTime({ts:e,zone:normalizeZone(t.zone,Settings.defaultZone),loc:Locale.fromObject(t)});throw new InvalidArgumentError(`fromMillis requires a numerical input, but received a ${typeof e} with value ${e}`)}static fromSeconds(e,t={}){if(isNumber(e))return new DateTime({ts:1e3*e,zone:normalizeZone(t.zone,Settings.defaultZone),loc:Locale.fromObject(t)});throw new InvalidArgumentError("fromSeconds requires a numerical input")}static fromObject(e,t={}){e=e||{};let r=normalizeZone(t.zone,Settings.defaultZone);if(!r.isValid)return DateTime.invalid(unsupportedZone(r));let n=Locale.fromObject(t),a=normalizeObject(e,normalizeUnitWithLocalWeeks),{minDaysInFirstWeek:i,startOfWeek:o}=usesLocalWeekValues(a,n),s=Settings.now(),l=isUndefined(t.specificOffset)?r.offset(s):t.specificOffset,d=!isUndefined(a.ordinal),u=!isUndefined(a.year),c=!isUndefined(a.month)||!isUndefined(a.day),p=u||c,y=a.weekYear||a.weekNumber;if((p||d)&&y)throw new ConflictingSpecificationError("Can't mix weekYear/weekNumber units with year/month/day or ordinals");if(c&&d)throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");let m=y||a.weekday&&!p,h,f,b=tsToObj(s,l);m?(h=e4,f=e0,b=gregorianToWeek(b,i,o)):d?(h=e3,f=e1,b=gregorianToOrdinal(b)):(h=e2,f=eQ);let K=!1;for(let e of h){let t=a[e];isUndefined(t)?K?a[e]=f[e]:a[e]=b[e]:K=!0}let g=m?function(e,t=4,r=1){let n=isInteger(e.weekYear),a=integerBetween(e.weekNumber,1,weeksInWeekYear(e.weekYear,t,r)),i=integerBetween(e.weekday,1,7);return n?a?!i&&unitOutOfRange("weekday",e.weekday):unitOutOfRange("week",e.weekNumber):unitOutOfRange("weekYear",e.weekYear)}(a,i,o):d?function(e){let t=isInteger(e.year),r=integerBetween(e.ordinal,1,daysInYear(e.year));return t?!r&&unitOutOfRange("ordinal",e.ordinal):unitOutOfRange("year",e.year)}(a):hasInvalidGregorianData(a),v=g||hasInvalidTimeData(a);if(v)return DateTime.invalid(v);let I=m?weekToGregorian(a,i,o):d?ordinalToGregorian(a):a,[E,S]=fixOffset(objToLocalTS(I),l,r),j=new DateTime({ts:E,zone:r,o:S,loc:n});return a.weekday&&p&&e.weekday!==j.weekday?DateTime.invalid("mismatched weekday",`you can't specify both a weekday of ${a.weekday} and a date of ${j.toISO()}`):j.isValid?j:DateTime.invalid(j.invalid)}static fromISO(e,t={}){let[r,n]=parse(e,[eT,eR],[eD,eP],[eO,eC],[eA,eM]);return parseDataToDateTime(r,n,t,"ISO 8601",e)}static fromRFC2822(e,t={}){let[r,n]=parse(e.replace(/\([^()]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").trim(),[ej,extractRFC2822]);return parseDataToDateTime(r,n,t,"RFC 2822",e)}static fromHTTP(e,t={}){let[r,n]=parse(e,[ek,extractRFC1123Or850],[ex,extractRFC1123Or850],[ew,extractASCII]);return parseDataToDateTime(r,n,t,"HTTP",t)}static fromFormat(e,t,r={}){if(isUndefined(e)||isUndefined(t))throw new InvalidArgumentError("fromFormat requires an input string and a format");let{locale:n=null,numberingSystem:a=null}=r,i=Locale.fromOpts({locale:n,numberingSystem:a,defaultToEN:!0}),[o,s,l,d]=function(e,t,r){let{result:n,zone:a,specificOffset:i,invalidReason:o}=explainFromTokens(e,t,r);return[n,a,i,o]}(i,e,t);return d?DateTime.invalid(d):parseDataToDateTime(o,s,r,`format ${t}`,e,l)}static fromString(e,t,r={}){return DateTime.fromFormat(e,t,r)}static fromSQL(e,t={}){let[r,n]=parse(e,[eJ,eR],[eL,eN]);return parseDataToDateTime(r,n,t,"SQL",e)}static invalid(e,t=null){if(!e)throw new InvalidArgumentError("need to specify a reason the DateTime is invalid");let r=e instanceof Invalid?e:new Invalid(e,t);if(!Settings.throwOnInvalid)return new DateTime({invalid:r});throw new InvalidDateTimeError(r)}static isDateTime(e){return e&&e.isLuxonDateTime||!1}static parseFormatForOpts(e,t={}){let r=formatOptsToTokens(e,Locale.fromObject(t));return r?r.map(e=>e?e.val:null).join(""):null}static expandFormat(e,t={}){let r=expandMacroTokens(Formatter.parseFormat(e),Locale.fromObject(t));return r.map(e=>e.val).join("")}static resetCache(){r=void 0,e6.clear()}get(e){return this[e]}get isValid(){return null===this.invalid}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}get locale(){return this.isValid?this.loc.locale:null}get numberingSystem(){return this.isValid?this.loc.numberingSystem:null}get outputCalendar(){return this.isValid?this.loc.outputCalendar:null}get zone(){return this._zone}get zoneName(){return this.isValid?this.zone.name:null}get year(){return this.isValid?this.c.year:NaN}get quarter(){return this.isValid?Math.ceil(this.c.month/3):NaN}get month(){return this.isValid?this.c.month:NaN}get day(){return this.isValid?this.c.day:NaN}get hour(){return this.isValid?this.c.hour:NaN}get minute(){return this.isValid?this.c.minute:NaN}get second(){return this.isValid?this.c.second:NaN}get millisecond(){return this.isValid?this.c.millisecond:NaN}get weekYear(){return this.isValid?possiblyCachedWeekData(this).weekYear:NaN}get weekNumber(){return this.isValid?possiblyCachedWeekData(this).weekNumber:NaN}get weekday(){return this.isValid?possiblyCachedWeekData(this).weekday:NaN}get isWeekend(){return this.isValid&&this.loc.getWeekendDays().includes(this.weekday)}get localWeekday(){return this.isValid?possiblyCachedLocalWeekData(this).weekday:NaN}get localWeekNumber(){return this.isValid?possiblyCachedLocalWeekData(this).weekNumber:NaN}get localWeekYear(){return this.isValid?possiblyCachedLocalWeekData(this).weekYear:NaN}get ordinal(){return this.isValid?gregorianToOrdinal(this.c).ordinal:NaN}get monthShort(){return this.isValid?Info.months("short",{locObj:this.loc})[this.month-1]:null}get monthLong(){return this.isValid?Info.months("long",{locObj:this.loc})[this.month-1]:null}get weekdayShort(){return this.isValid?Info.weekdays("short",{locObj:this.loc})[this.weekday-1]:null}get weekdayLong(){return this.isValid?Info.weekdays("long",{locObj:this.loc})[this.weekday-1]:null}get offset(){return this.isValid?+this.o:NaN}get offsetNameShort(){return this.isValid?this.zone.offsetName(this.ts,{format:"short",locale:this.locale}):null}get offsetNameLong(){return this.isValid?this.zone.offsetName(this.ts,{format:"long",locale:this.locale}):null}get isOffsetFixed(){return this.isValid?this.zone.isUniversal:null}get isInDST(){return!this.isOffsetFixed&&(this.offset>this.set({month:1,day:1}).offset||this.offset>this.set({month:5}).offset)}getPossibleOffsets(){if(!this.isValid||this.isOffsetFixed)return[this];let e=objToLocalTS(this.c),t=this.zone.offset(e-864e5),r=this.zone.offset(e+864e5),n=this.zone.offset(e-6e4*t),a=this.zone.offset(e-6e4*r);if(n===a)return[this];let i=e-6e4*n,o=e-6e4*a,s=tsToObj(i,n),l=tsToObj(o,a);return s.hour===l.hour&&s.minute===l.minute&&s.second===l.second&&s.millisecond===l.millisecond?[clone(this,{ts:i}),clone(this,{ts:o})]:[this]}get isInLeapYear(){return isLeapYear(this.year)}get daysInMonth(){return daysInMonth(this.year,this.month)}get daysInYear(){return this.isValid?daysInYear(this.year):NaN}get weeksInWeekYear(){return this.isValid?weeksInWeekYear(this.weekYear):NaN}get weeksInLocalWeekYear(){return this.isValid?weeksInWeekYear(this.localWeekYear,this.loc.getMinDaysInFirstWeek(),this.loc.getStartOfWeek()):NaN}resolvedLocaleOptions(e={}){let{locale:t,numberingSystem:r,calendar:n}=Formatter.create(this.loc.clone(e),e).resolvedOptions(this);return{locale:t,numberingSystem:r,outputCalendar:n}}toUTC(e=0,t={}){return this.setZone(FixedOffsetZone.instance(e),t)}toLocal(){return this.setZone(Settings.defaultZone)}setZone(e,{keepLocalTime:t=!1,keepCalendarTime:r=!1}={}){if((e=normalizeZone(e,Settings.defaultZone)).equals(this.zone))return this;if(!e.isValid)return DateTime.invalid(unsupportedZone(e));{let a=this.ts;if(t||r){var n;let t=e.offset(this.ts),r=this.toObject();[a]=(n=e,fixOffset(objToLocalTS(r),t,n))}return clone(this,{ts:a,zone:e})}}reconfigure({locale:e,numberingSystem:t,outputCalendar:r}={}){let n=this.loc.clone({locale:e,numberingSystem:t,outputCalendar:r});return clone(this,{loc:n})}setLocale(e){return this.reconfigure({locale:e})}set(e){var t,r,n;let a;if(!this.isValid)return this;let i=normalizeObject(e,normalizeUnitWithLocalWeeks),{minDaysInFirstWeek:o,startOfWeek:s}=usesLocalWeekValues(i,this.loc),l=!isUndefined(i.weekYear)||!isUndefined(i.weekNumber)||!isUndefined(i.weekday),d=!isUndefined(i.ordinal),u=!isUndefined(i.year),c=!isUndefined(i.month)||!isUndefined(i.day),p=i.weekYear||i.weekNumber;if((u||c||d)&&p)throw new ConflictingSpecificationError("Can't mix weekYear/weekNumber units with year/month/day or ordinals");if(c&&d)throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");l?a=weekToGregorian({...gregorianToWeek(this.c,o,s),...i},o,s):isUndefined(i.ordinal)?(a={...this.toObject(),...i},isUndefined(i.day)&&(a.day=Math.min(daysInMonth(a.year,a.month),a.day))):a=ordinalToGregorian({...gregorianToOrdinal(this.c),...i});let[y,m]=(t=a,r=this.o,n=this.zone,fixOffset(objToLocalTS(t),r,n));return clone(this,{ts:y,o:m})}plus(e){if(!this.isValid)return this;let t=Duration.fromDurationLike(e);return clone(this,adjustTime(this,t))}minus(e){if(!this.isValid)return this;let t=Duration.fromDurationLike(e).negate();return clone(this,adjustTime(this,t))}startOf(e,{useLocaleWeeks:t=!1}={}){if(!this.isValid)return this;let r={},n=Duration.normalizeUnit(e);switch(n){case"years":r.month=1;case"quarters":case"months":r.day=1;case"weeks":case"days":r.hour=0;case"hours":r.minute=0;case"minutes":r.second=0;case"seconds":r.millisecond=0}if("weeks"===n){if(t){let e=this.loc.getStartOfWeek(),{weekday:t}=this;t<e&&(r.weekNumber=this.weekNumber-1),r.weekday=e}else r.weekday=1}if("quarters"===n){let e=Math.ceil(this.month/3);r.month=(e-1)*3+1}return this.set(r)}endOf(e,t){return this.isValid?this.plus({[e]:1}).startOf(e,t).minus(1):this}toFormat(e,t={}){return this.isValid?Formatter.create(this.loc.redefaultToEN(t)).formatDateTimeFromString(this,e):eX}toLocaleString(e=o,t={}){return this.isValid?Formatter.create(this.loc.clone(t),e).formatDateTime(this):eX}toLocaleParts(e={}){return this.isValid?Formatter.create(this.loc.clone(e),e).formatDateTimeParts(this):[]}toISO({format:e="extended",suppressSeconds:t=!1,suppressMilliseconds:r=!1,includeOffset:n=!0,extendedZone:a=!1,precision:i="milliseconds"}={}){if(!this.isValid)return null;i=normalizeUnit(i);let o="extended"===e,s=toISODate(this,o,i);return e2.indexOf(i)>=3&&(s+="T"),s+=toISOTime(this,o,t,r,n,a,i)}toISODate({format:e="extended",precision:t="day"}={}){return this.isValid?toISODate(this,"extended"===e,normalizeUnit(t)):null}toISOWeekDate(){return toTechFormat(this,"kkkk-'W'WW-c")}toISOTime({suppressMilliseconds:e=!1,suppressSeconds:t=!1,includeOffset:r=!0,includePrefix:n=!1,extendedZone:a=!1,format:i="extended",precision:o="milliseconds"}={}){return this.isValid?(o=normalizeUnit(o),(n&&e2.indexOf(o)>=3?"T":"")+toISOTime(this,"extended"===i,t,e,r,a,o)):null}toRFC2822(){return toTechFormat(this,"EEE, dd LLL yyyy HH:mm:ss ZZZ",!1)}toHTTP(){return toTechFormat(this.toUTC(),"EEE, dd LLL yyyy HH:mm:ss 'GMT'")}toSQLDate(){return this.isValid?toISODate(this,!0):null}toSQLTime({includeOffset:e=!0,includeZone:t=!1,includeOffsetSpace:r=!0}={}){let n="HH:mm:ss.SSS";return(t||e)&&(r&&(n+=" "),t?n+="z":e&&(n+="ZZ")),toTechFormat(this,n,!0)}toSQL(e={}){return this.isValid?`${this.toSQLDate()} ${this.toSQLTime(e)}`:null}toString(){return this.isValid?this.toISO():eX}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`:`DateTime { Invalid, reason: ${this.invalidReason} }`}valueOf(){return this.toMillis()}toMillis(){return this.isValid?this.ts:NaN}toSeconds(){return this.isValid?this.ts/1e3:NaN}toUnixInteger(){return this.isValid?Math.floor(this.ts/1e3):NaN}toJSON(){return this.toISO()}toBSON(){return this.toJSDate()}toObject(e={}){if(!this.isValid)return{};let t={...this.c};return e.includeConfig&&(t.outputCalendar=this.outputCalendar,t.numberingSystem=this.loc.numberingSystem,t.locale=this.loc.locale),t}toJSDate(){return new Date(this.isValid?this.ts:NaN)}diff(e,t="milliseconds",r={}){if(!this.isValid||!e.isValid)return Duration.invalid("created by diffing an invalid DateTime");let n={locale:this.locale,numberingSystem:this.numberingSystem,...r},a=(Array.isArray(t)?t:[t]).map(Duration.normalizeUnit),i=e.valueOf()>this.valueOf(),o=function(e,t,r,n){let[a,i,o,s]=function(e,t,r){let n,a;let i=[["years",(e,t)=>t.year-e.year],["quarters",(e,t)=>t.quarter-e.quarter+(t.year-e.year)*4],["months",(e,t)=>t.month-e.month+(t.year-e.year)*12],["weeks",(e,t)=>{let r=dayDiff(e,t);return(r-r%7)/7}],["days",dayDiff]],o={},s=e;for(let[l,d]of i)r.indexOf(l)>=0&&(n=l,o[l]=d(e,t),(a=s.plus(o))>t?(o[l]--,(e=s.plus(o))>t&&(a=e,o[l]--,e=s.plus(o))):e=a);return[e,o,a,n]}(e,t,r),l=t-a,d=r.filter(e=>["hours","minutes","seconds","milliseconds"].indexOf(e)>=0);0===d.length&&(o<t&&(o=a.plus({[s]:1})),o!==a&&(i[s]=(i[s]||0)+l/(o-a)));let u=Duration.fromObject(i,n);return d.length>0?Duration.fromMillis(l,n).shiftTo(...d).plus(u):u}(i?this:e,i?e:this,a,n);return i?o.negate():o}diffNow(e="milliseconds",t={}){return this.diff(DateTime.now(),e,t)}until(e){return this.isValid?Interval.fromDateTimes(this,e):this}hasSame(e,t,r){if(!this.isValid)return!1;let n=e.valueOf(),a=this.setZone(e.zone,{keepLocalTime:!0});return a.startOf(t,r)<=n&&n<=a.endOf(t,r)}equals(e){return this.isValid&&e.isValid&&this.valueOf()===e.valueOf()&&this.zone.equals(e.zone)&&this.loc.equals(e.loc)}toRelative(e={}){if(!this.isValid)return null;let t=e.base||DateTime.fromObject({},{zone:this.zone}),r=e.padding?this<t?-e.padding:e.padding:0,n=["years","months","days","hours","minutes","seconds"],a=e.unit;return Array.isArray(e.unit)&&(n=e.unit,a=void 0),diffRelative(t,this.plus(r),{...e,numeric:"always",units:n,unit:a})}toRelativeCalendar(e={}){return this.isValid?diffRelative(e.base||DateTime.fromObject({},{zone:this.zone}),this,{...e,numeric:"auto",units:["years","months","days"],calendary:!0}):null}static min(...e){if(!e.every(DateTime.isDateTime))throw new InvalidArgumentError("min requires all arguments be DateTimes");return bestBy(e,e=>e.valueOf(),Math.min)}static max(...e){if(!e.every(DateTime.isDateTime))throw new InvalidArgumentError("max requires all arguments be DateTimes");return bestBy(e,e=>e.valueOf(),Math.max)}static fromFormatExplain(e,t,r={}){let{locale:n=null,numberingSystem:a=null}=r,i=Locale.fromOpts({locale:n,numberingSystem:a,defaultToEN:!0});return explainFromTokens(i,e,t)}static fromStringExplain(e,t,r={}){return DateTime.fromFormatExplain(e,t,r)}static buildFormatParser(e,t={}){let{locale:r=null,numberingSystem:n=null}=t,a=Locale.fromOpts({locale:r,numberingSystem:n,defaultToEN:!0});return new TokenParser(a,e)}static fromFormatParser(e,t,r={}){if(isUndefined(e)||isUndefined(t))throw new InvalidArgumentError("fromFormatParser requires an input string and a format parser");let{locale:n=null,numberingSystem:a=null}=r,i=Locale.fromOpts({locale:n,numberingSystem:a,defaultToEN:!0});if(!i.equals(t.locale))throw new InvalidArgumentError(`fromFormatParser called with a locale of ${i}, but the format parser was created for ${t.locale}`);let{result:o,zone:s,specificOffset:l,invalidReason:d}=t.explainFromTokens(e);return d?DateTime.invalid(d):parseDataToDateTime(o,s,r,`format ${t.format}`,e,l)}static get DATE_SHORT(){return o}static get DATE_MED(){return s}static get DATE_MED_WITH_WEEKDAY(){return l}static get DATE_FULL(){return d}static get DATE_HUGE(){return u}static get TIME_SIMPLE(){return c}static get TIME_WITH_SECONDS(){return p}static get TIME_WITH_SHORT_OFFSET(){return y}static get TIME_WITH_LONG_OFFSET(){return m}static get TIME_24_SIMPLE(){return h}static get TIME_24_WITH_SECONDS(){return f}static get TIME_24_WITH_SHORT_OFFSET(){return b}static get TIME_24_WITH_LONG_OFFSET(){return K}static get DATETIME_SHORT(){return g}static get DATETIME_SHORT_WITH_SECONDS(){return v}static get DATETIME_MED(){return I}static get DATETIME_MED_WITH_SECONDS(){return E}static get DATETIME_MED_WITH_WEEKDAY(){return S}static get DATETIME_FULL(){return j}static get DATETIME_FULL_WITH_SECONDS(){return k}static get DATETIME_HUGE(){return x}static get DATETIME_HUGE_WITH_SECONDS(){return w}};function friendlyDateTime(e){if(DateTime.isDateTime(e))return e;if(e&&e.valueOf&&isNumber(e.valueOf()))return DateTime.fromJSDate(e);if(e&&"object"==typeof e)return DateTime.fromObject(e);throw new InvalidArgumentError(`Unknown datetime argument: ${e}, of type ${typeof e}`)}t.DateTime=DateTime,t.Duration=Duration,t.FixedOffsetZone=FixedOffsetZone,t.IANAZone=IANAZone,t.Info=Info,t.Interval=Interval,t.InvalidZone=InvalidZone,t.Settings=Settings,t.SystemZone=SystemZone,t.VERSION="3.7.2",t.Zone=Zone},49476:(e,t,r)=>{e.exports=r(69218)(__dirname)},36784:(e,t,r)=>{let{EventEmitter:n}=r(82361);let AbortSignal=class AbortSignal{constructor(){this.eventEmitter=new n,this.onabort=null,this.aborted=!1,this.reason=void 0}toString(){return"[object AbortSignal]"}get[Symbol.toStringTag](){return"AbortSignal"}removeEventListener(e,t){this.eventEmitter.removeListener(e,t)}addEventListener(e,t){this.eventEmitter.on(e,t)}dispatchEvent(e){let t={type:e,target:this},r=`on${e}`;"function"==typeof this[r]&&this[r](t),this.eventEmitter.emit(e,t)}throwIfAborted(){if(this.aborted)throw this.reason}static abort(e){let t=new AbortController;return t.abort(),t.signal}static timeout(e){let t=new AbortController;return setTimeout(()=>t.abort(Error("TimeoutError")),e),t.signal}};let AbortController=class AbortController{constructor(){this.signal=new AbortSignal}abort(e){this.signal.aborted||(this.signal.aborted=!0,e?this.signal.reason=e:this.signal.reason=Error("AbortError"),this.signal.dispatchEvent("abort"))}toString(){return"[object AbortController]"}get[Symbol.toStringTag](){return"AbortController"}};e.exports={AbortController,AbortSignal}},69218:(e,t,r)=>{let n=require;"function"==typeof n.addon?e.exports=n.addon.bind(n):e.exports=r(20474)},20474:(e,t,r)=>{var n=r(57147),a=r(71017),i=r(57310),o=r(22037),s=require,l=process.config&&process.config.variables||{},d=!!process.env.PREBUILDS_ONLY,u=process.versions,c=u.modules;(u.deno||process.isBun)&&(c="unsupported");var p=process.versions&&process.versions.electron||process.env.ELECTRON_RUN_AS_NODE?"electron":process.versions&&process.versions.nw?"node-webkit":"node",y=process.env.npm_config_arch||o.arch(),m=process.env.npm_config_platform||o.platform(),h=process.env.LIBC||(!function(e){if("linux"!==e)return!1;let{familySync:t,MUSL:n}=r(68819);return t()===n}(m)?"glibc":"musl"),f=process.env.ARM_VERSION||("arm64"===y?"8":l.arm_version)||"",b=(u.uv||"").split(".")[0];function load(e){return s(load.resolve(e))}function readdirSync(e){try{return n.readdirSync(e)}catch(e){return[]}}function getFirst(e,t){var r=readdirSync(e).filter(t);return r[0]&&a.join(e,r[0])}function matchBuild(e){return/\.node$/.test(e)}function parseTuple(e){var t=e.split("-");if(2===t.length){var r=t[0],n=t[1].split("+");if(r&&n.length&&n.every(Boolean))return{name:e,platform:r,architectures:n}}}function matchTuple(e,t){return function(r){return null!=r&&r.platform===e&&r.architectures.includes(t)}}function compareTuples(e,t){return e.architectures.length-t.architectures.length}function parseTags(e){var t=e.split("."),r=t.pop(),n={file:e,specificity:0};if("node"===r){for(var a=0;a<t.length;a++){var i=t[a];if("node"===i||"electron"===i||"node-webkit"===i)n.runtime=i;else if("napi"===i)n.napi=!0;else if("abi"===i.slice(0,3))n.abi=i.slice(3);else if("uv"===i.slice(0,2))n.uv=i.slice(2);else if("armv"===i.slice(0,4))n.armv=i.slice(4);else{if("glibc"!==i&&"musl"!==i)continue;n.libc=i}n.specificity++}return n}}function matchTags(e,t){return function(r){return null!=r&&(r.runtime===e||!!("node"===r.runtime&&r.napi))&&(r.abi===t||!!r.napi)&&(!r.uv||r.uv===b)&&(!r.armv||r.armv===f)&&(!r.libc||r.libc===h)}}function compareTags(e){return function(t,r){return t.runtime!==r.runtime?t.runtime===e?-1:1:t.abi!==r.abi?t.abi?-1:1:t.specificity!==r.specificity?t.specificity>r.specificity?-1:1:0}}e.exports=load,load.resolve=load.path=function(e){e=a.resolve(e||".");var t,n,o="";try{var l=(o=s(a.join(e,"package.json")).name).toUpperCase().replace(/-/g,"_");process.env[l+"_PREBUILD"]&&(e=process.env[l+"_PREBUILD"])}catch(e){t=e}if(!d){var u=getFirst(a.join(e,"build/Release"),matchBuild);if(u)return u;var K=getFirst(a.join(e,"build/Debug"),matchBuild);if(K)return K}var g=resolve(e);if(g)return g;var v=resolve(a.dirname(process.execPath));if(v)return v;var I=("@"==o[0]?"":"@"+o+"/")+o+"-"+m+"-"+y;try{var E=a.dirname(r(98188).createRequire(i.pathToFileURL(a.join(e,"package.json"))).resolve(I));return resolveFile(E)}catch(e){n=e}let S="No native build was found for "+["platform="+m,"arch="+y,"runtime="+p,"abi="+c,"uv="+b,f?"armv="+f:"","libc="+h,"node="+process.versions.node,process.versions.electron?"electron="+process.versions.electron:"","webpack=true"].filter(Boolean).join(" ")+"\n    attempted loading from: "+e+" and package: "+I+"\n";throw t&&(S+="Error finding package.json: "+t.message+"\n"),n&&(S+="Error resolving package: "+n.message+"\n"),Error(S);function resolve(e){var t=readdirSync(a.join(e,"prebuilds")).map(parseTuple).filter(matchTuple(m,y)).sort(compareTuples)[0];if(t)return resolveFile(a.join(e,"prebuilds",t.name))}function resolveFile(e){var t=readdirSync(e).map(parseTags).filter(matchTags(p,c)).sort(compareTags(p))[0];if(t)return a.join(e,t.file)}},load.parseTags=parseTags,load.matchTags=matchTags,load.compareTags=compareTags,load.parseTuple=parseTuple,load.matchTuple=matchTuple,load.compareTuples=compareTuples},94720:(e,t,r)=>{let n=Symbol("SemVer ANY");let Comparator=class Comparator{static get ANY(){return n}constructor(e,t){if(t=a(t),e instanceof Comparator){if(!!t.loose===e.loose)return e;e=e.value}l("comparator",e=e.trim().split(/\s+/).join(" "),t),this.options=t,this.loose=!!t.loose,this.parse(e),this.semver===n?this.value="":this.value=this.operator+this.semver.version,l("comp",this)}parse(e){let t=this.options.loose?i[o.COMPARATORLOOSE]:i[o.COMPARATOR],r=e.match(t);if(!r)throw TypeError(`Invalid comparator: ${e}`);this.operator=void 0!==r[1]?r[1]:"","="===this.operator&&(this.operator=""),r[2]?this.semver=new d(r[2],this.options.loose):this.semver=n}toString(){return this.value}test(e){if(l("Comparator.test",e,this.options.loose),this.semver===n||e===n)return!0;if("string"==typeof e)try{e=new d(e,this.options)}catch(e){return!1}return s(e,this.operator,this.semver,this.options)}intersects(e,t){if(!(e instanceof Comparator))throw TypeError("a Comparator is required");return""===this.operator?""===this.value||new u(e.value,t).test(this.value):""===e.operator?""===e.value||new u(this.value,t).test(e.semver):!((t=a(t)).includePrerelease&&("<0.0.0-0"===this.value||"<0.0.0-0"===e.value)||!t.includePrerelease&&(this.value.startsWith("<0.0.0")||e.value.startsWith("<0.0.0")))&&!!(this.operator.startsWith(">")&&e.operator.startsWith(">")||this.operator.startsWith("<")&&e.operator.startsWith("<")||this.semver.version===e.semver.version&&this.operator.includes("=")&&e.operator.includes("=")||s(this.semver,"<",e.semver,t)&&this.operator.startsWith(">")&&e.operator.startsWith("<")||s(this.semver,">",e.semver,t)&&this.operator.startsWith("<")&&e.operator.startsWith(">"))}};e.exports=Comparator;let a=r(66152),{safeRe:i,t:o}=r(82652),s=r(1393),l=r(22274),d=r(66956),u=r(53703)},53703:(e,t,r)=>{let n=/\s+/g;let Range=class Range{constructor(e,t){if(t=o(t),e instanceof Range){if(!!t.loose===e.loose&&!!t.includePrerelease===e.includePrerelease)return e;return new Range(e.raw,t)}if(e instanceof s)return this.raw=e.value,this.set=[[e]],this.formatted=void 0,this;if(this.options=t,this.loose=!!t.loose,this.includePrerelease=!!t.includePrerelease,this.raw=e.trim().replace(n," "),this.set=this.raw.split("||").map(e=>this.parseRange(e.trim())).filter(e=>e.length),!this.set.length)throw TypeError(`Invalid SemVer Range: ${this.raw}`);if(this.set.length>1){let e=this.set[0];if(this.set=this.set.filter(e=>!isNullSet(e[0])),0===this.set.length)this.set=[e];else if(this.set.length>1){for(let e of this.set)if(1===e.length&&isAny(e[0])){this.set=[e];break}}}this.formatted=void 0}get range(){if(void 0===this.formatted){this.formatted="";for(let e=0;e<this.set.length;e++){e>0&&(this.formatted+="||");let t=this.set[e];for(let e=0;e<t.length;e++)e>0&&(this.formatted+=" "),this.formatted+=t[e].toString().trim()}}return this.formatted}format(){return this.range}toString(){return this.range}parseRange(e){let t=(this.options.includePrerelease&&h)|(this.options.loose&&f),r=t+":"+e,n=i.get(r);if(n)return n;let a=this.options.loose,o=a?u[c.HYPHENRANGELOOSE]:u[c.HYPHENRANGE];l("hyphen replace",e=e.replace(o,hyphenReplace(this.options.includePrerelease))),l("comparator trim",e=e.replace(u[c.COMPARATORTRIM],p)),l("tilde trim",e=e.replace(u[c.TILDETRIM],y)),l("caret trim",e=e.replace(u[c.CARETTRIM],m));let d=e.split(" ").map(e=>parseComparator(e,this.options)).join(" ").split(/\s+/).map(e=>replaceGTE0(e,this.options));a&&(d=d.filter(e=>(l("loose invalid filter",e,this.options),!!e.match(u[c.COMPARATORLOOSE])))),l("range list",d);let b=new Map,K=d.map(e=>new s(e,this.options));for(let e of K){if(isNullSet(e))return[e];b.set(e.value,e)}b.size>1&&b.has("")&&b.delete("");let g=[...b.values()];return i.set(r,g),g}intersects(e,t){if(!(e instanceof Range))throw TypeError("a Range is required");return this.set.some(r=>isSatisfiable(r,t)&&e.set.some(e=>isSatisfiable(e,t)&&r.every(r=>e.every(e=>r.intersects(e,t)))))}test(e){if(!e)return!1;if("string"==typeof e)try{e=new d(e,this.options)}catch(e){return!1}for(let t=0;t<this.set.length;t++)if(testSet(this.set[t],e,this.options))return!0;return!1}};e.exports=Range;let a=r(81408),i=new a,o=r(66152),s=r(94720),l=r(22274),d=r(66956),{safeRe:u,t:c,comparatorTrimReplace:p,tildeTrimReplace:y,caretTrimReplace:m}=r(82652),{FLAG_INCLUDE_PRERELEASE:h,FLAG_LOOSE:f}=r(53160),isNullSet=e=>"<0.0.0-0"===e.value,isAny=e=>""===e.value,isSatisfiable=(e,t)=>{let r=!0,n=e.slice(),a=n.pop();for(;r&&n.length;)r=n.every(e=>a.intersects(e,t)),a=n.pop();return r},parseComparator=(e,t)=>(l("comp",e=e.replace(u[c.BUILD],""),t),l("caret",e=replaceCarets(e,t)),l("tildes",e=replaceTildes(e,t)),l("xrange",e=replaceXRanges(e,t)),l("stars",e=replaceStars(e,t)),e),isX=e=>!e||"x"===e.toLowerCase()||"*"===e,replaceTildes=(e,t)=>e.trim().split(/\s+/).map(e=>replaceTilde(e,t)).join(" "),replaceTilde=(e,t)=>{let r=t.loose?u[c.TILDELOOSE]:u[c.TILDE];return e.replace(r,(t,r,n,a,i)=>{let o;return l("tilde",e,t,r,n,a,i),isX(r)?o="":isX(n)?o=`>=${r}.0.0 <${+r+1}.0.0-0`:isX(a)?o=`>=${r}.${n}.0 <${r}.${+n+1}.0-0`:i?(l("replaceTilde pr",i),o=`>=${r}.${n}.${a}-${i} <${r}.${+n+1}.0-0`):o=`>=${r}.${n}.${a} <${r}.${+n+1}.0-0`,l("tilde return",o),o})},replaceCarets=(e,t)=>e.trim().split(/\s+/).map(e=>replaceCaret(e,t)).join(" "),replaceCaret=(e,t)=>{l("caret",e,t);let r=t.loose?u[c.CARETLOOSE]:u[c.CARET],n=t.includePrerelease?"-0":"";return e.replace(r,(t,r,a,i,o)=>{let s;return l("caret",e,t,r,a,i,o),isX(r)?s="":isX(a)?s=`>=${r}.0.0${n} <${+r+1}.0.0-0`:isX(i)?s="0"===r?`>=${r}.${a}.0${n} <${r}.${+a+1}.0-0`:`>=${r}.${a}.0${n} <${+r+1}.0.0-0`:o?(l("replaceCaret pr",o),s="0"===r?"0"===a?`>=${r}.${a}.${i}-${o} <${r}.${a}.${+i+1}-0`:`>=${r}.${a}.${i}-${o} <${r}.${+a+1}.0-0`:`>=${r}.${a}.${i}-${o} <${+r+1}.0.0-0`):(l("no pr"),s="0"===r?"0"===a?`>=${r}.${a}.${i}${n} <${r}.${a}.${+i+1}-0`:`>=${r}.${a}.${i}${n} <${r}.${+a+1}.0-0`:`>=${r}.${a}.${i} <${+r+1}.0.0-0`),l("caret return",s),s})},replaceXRanges=(e,t)=>(l("replaceXRanges",e,t),e.split(/\s+/).map(e=>replaceXRange(e,t)).join(" ")),replaceXRange=(e,t)=>{e=e.trim();let r=t.loose?u[c.XRANGELOOSE]:u[c.XRANGE];return e.replace(r,(r,n,a,i,o,s)=>{l("xRange",e,r,n,a,i,o,s);let d=isX(a),u=d||isX(i),c=u||isX(o);return"="===n&&c&&(n=""),s=t.includePrerelease?"-0":"",d?r=">"===n||"<"===n?"<0.0.0-0":"*":n&&c?(u&&(i=0),o=0,">"===n?(n=">=",u?(a=+a+1,i=0):i=+i+1,o=0):"<="===n&&(n="<",u?a=+a+1:i=+i+1),"<"===n&&(s="-0"),r=`${n+a}.${i}.${o}${s}`):u?r=`>=${a}.0.0${s} <${+a+1}.0.0-0`:c&&(r=`>=${a}.${i}.0${s} <${a}.${+i+1}.0-0`),l("xRange return",r),r})},replaceStars=(e,t)=>(l("replaceStars",e,t),e.trim().replace(u[c.STAR],"")),replaceGTE0=(e,t)=>(l("replaceGTE0",e,t),e.trim().replace(u[t.includePrerelease?c.GTE0PRE:c.GTE0],"")),hyphenReplace=e=>(t,r,n,a,i,o,s,l,d,u,c,p)=>(r=isX(n)?"":isX(a)?`>=${n}.0.0${e?"-0":""}`:isX(i)?`>=${n}.${a}.0${e?"-0":""}`:o?`>=${r}`:`>=${r}${e?"-0":""}`,l=isX(d)?"":isX(u)?`<${+d+1}.0.0-0`:isX(c)?`<${d}.${+u+1}.0-0`:p?`<=${d}.${u}.${c}-${p}`:e?`<${d}.${u}.${+c+1}-0`:`<=${l}`,`${r} ${l}`.trim()),testSet=(e,t,r)=>{for(let r=0;r<e.length;r++)if(!e[r].test(t))return!1;if(t.prerelease.length&&!r.includePrerelease){for(let r=0;r<e.length;r++)if(l(e[r].semver),e[r].semver!==s.ANY&&e[r].semver.prerelease.length>0){let n=e[r].semver;if(n.major===t.major&&n.minor===t.minor&&n.patch===t.patch)return!0}return!1}return!0}},66956:(e,t,r)=>{let n=r(22274),{MAX_LENGTH:a,MAX_SAFE_INTEGER:i}=r(53160),{safeRe:o,t:s}=r(82652),l=r(66152),{compareIdentifiers:d}=r(21974);let SemVer=class SemVer{constructor(e,t){if(t=l(t),e instanceof SemVer){if(!!t.loose===e.loose&&!!t.includePrerelease===e.includePrerelease)return e;e=e.version}else if("string"!=typeof e)throw TypeError(`Invalid version. Must be a string. Got type "${typeof e}".`);if(e.length>a)throw TypeError(`version is longer than ${a} characters`);n("SemVer",e,t),this.options=t,this.loose=!!t.loose,this.includePrerelease=!!t.includePrerelease;let r=e.trim().match(t.loose?o[s.LOOSE]:o[s.FULL]);if(!r)throw TypeError(`Invalid Version: ${e}`);if(this.raw=e,this.major=+r[1],this.minor=+r[2],this.patch=+r[3],this.major>i||this.major<0)throw TypeError("Invalid major version");if(this.minor>i||this.minor<0)throw TypeError("Invalid minor version");if(this.patch>i||this.patch<0)throw TypeError("Invalid patch version");r[4]?this.prerelease=r[4].split(".").map(e=>{if(/^[0-9]+$/.test(e)){let t=+e;if(t>=0&&t<i)return t}return e}):this.prerelease=[],this.build=r[5]?r[5].split("."):[],this.format()}format(){return this.version=`${this.major}.${this.minor}.${this.patch}`,this.prerelease.length&&(this.version+=`-${this.prerelease.join(".")}`),this.version}toString(){return this.version}compare(e){if(n("SemVer.compare",this.version,this.options,e),!(e instanceof SemVer)){if("string"==typeof e&&e===this.version)return 0;e=new SemVer(e,this.options)}return e.version===this.version?0:this.compareMain(e)||this.comparePre(e)}compareMain(e){return(e instanceof SemVer||(e=new SemVer(e,this.options)),this.major<e.major)?-1:this.major>e.major?1:this.minor<e.minor?-1:this.minor>e.minor?1:this.patch<e.patch?-1:this.patch>e.patch?1:0}comparePre(e){if(e instanceof SemVer||(e=new SemVer(e,this.options)),this.prerelease.length&&!e.prerelease.length)return -1;if(!this.prerelease.length&&e.prerelease.length)return 1;if(!this.prerelease.length&&!e.prerelease.length)return 0;let t=0;do{let r=this.prerelease[t],a=e.prerelease[t];if(n("prerelease compare",t,r,a),void 0===r&&void 0===a)return 0;if(void 0===a)return 1;if(void 0===r)return -1;if(r===a)continue;else return d(r,a)}while(++t)}compareBuild(e){e instanceof SemVer||(e=new SemVer(e,this.options));let t=0;do{let r=this.build[t],a=e.build[t];if(n("build compare",t,r,a),void 0===r&&void 0===a)return 0;if(void 0===a)return 1;if(void 0===r)return -1;if(r===a)continue;else return d(r,a)}while(++t)}inc(e,t,r){if(e.startsWith("pre")){if(!t&&!1===r)throw Error("invalid increment argument: identifier is empty");if(t){let e=`-${t}`.match(this.options.loose?o[s.PRERELEASELOOSE]:o[s.PRERELEASE]);if(!e||e[1]!==t)throw Error(`invalid identifier: ${t}`)}}switch(e){case"premajor":this.prerelease.length=0,this.patch=0,this.minor=0,this.major++,this.inc("pre",t,r);break;case"preminor":this.prerelease.length=0,this.patch=0,this.minor++,this.inc("pre",t,r);break;case"prepatch":this.prerelease.length=0,this.inc("patch",t,r),this.inc("pre",t,r);break;case"prerelease":0===this.prerelease.length&&this.inc("patch",t,r),this.inc("pre",t,r);break;case"release":if(0===this.prerelease.length)throw Error(`version ${this.raw} is not a prerelease`);this.prerelease.length=0;break;case"major":(0!==this.minor||0!==this.patch||0===this.prerelease.length)&&this.major++,this.minor=0,this.patch=0,this.prerelease=[];break;case"minor":(0!==this.patch||0===this.prerelease.length)&&this.minor++,this.patch=0,this.prerelease=[];break;case"patch":0===this.prerelease.length&&this.patch++,this.prerelease=[];break;case"pre":{let e=Number(r)?1:0;if(0===this.prerelease.length)this.prerelease=[e];else{let n=this.prerelease.length;for(;--n>=0;)"number"==typeof this.prerelease[n]&&(this.prerelease[n]++,n=-2);if(-1===n){if(t===this.prerelease.join(".")&&!1===r)throw Error("invalid increment argument: identifier already exists");this.prerelease.push(e)}}if(t){let n=[t,e];!1===r&&(n=[t]),0===d(this.prerelease[0],t)?isNaN(this.prerelease[1])&&(this.prerelease=n):this.prerelease=n}break}default:throw Error(`invalid increment argument: ${e}`)}return this.raw=this.format(),this.build.length&&(this.raw+=`+${this.build.join(".")}`),this}};e.exports=SemVer},95967:(e,t,r)=>{let n=r(4469);e.exports=(e,t)=>{let r=n(e.trim().replace(/^[=v]+/,""),t);return r?r.version:null}},1393:(e,t,r)=>{let n=r(16918),a=r(85917),i=r(50222),o=r(33053),s=r(66984),l=r(28967);e.exports=(e,t,r,d)=>{switch(t){case"===":return"object"==typeof e&&(e=e.version),"object"==typeof r&&(r=r.version),e===r;case"!==":return"object"==typeof e&&(e=e.version),"object"==typeof r&&(r=r.version),e!==r;case"":case"=":case"==":return n(e,r,d);case"!=":return a(e,r,d);case">":return i(e,r,d);case">=":return o(e,r,d);case"<":return s(e,r,d);case"<=":return l(e,r,d);default:throw TypeError(`Invalid operator: ${t}`)}}},80686:(e,t,r)=>{let n=r(66956),a=r(4469),{safeRe:i,t:o}=r(82652);e.exports=(e,t)=>{if(e instanceof n)return e;if("number"==typeof e&&(e=String(e)),"string"!=typeof e)return null;let r=null;if((t=t||{}).rtl){let n;let a=t.includePrerelease?i[o.COERCERTLFULL]:i[o.COERCERTL];for(;(n=a.exec(e))&&(!r||r.index+r[0].length!==e.length);)r&&n.index+n[0].length===r.index+r[0].length||(r=n),a.lastIndex=n.index+n[1].length+n[2].length;a.lastIndex=-1}else r=e.match(t.includePrerelease?i[o.COERCEFULL]:i[o.COERCE]);if(null===r)return null;let s=r[2],l=r[3]||"0",d=r[4]||"0",u=t.includePrerelease&&r[5]?`-${r[5]}`:"",c=t.includePrerelease&&r[6]?`+${r[6]}`:"";return a(`${s}.${l}.${d}${u}${c}`,t)}},51655:(e,t,r)=>{let n=r(66956);e.exports=(e,t,r)=>{let a=new n(e,r),i=new n(t,r);return a.compare(i)||a.compareBuild(i)}},85518:(e,t,r)=>{let n=r(41890);e.exports=(e,t)=>n(e,t,!0)},41890:(e,t,r)=>{let n=r(66956);e.exports=(e,t,r)=>new n(e,r).compare(new n(t,r))},68837:(e,t,r)=>{let n=r(4469);e.exports=(e,t)=>{let r=n(e,null,!0),a=n(t,null,!0),i=r.compare(a);if(0===i)return null;let o=i>0,s=o?r:a,l=o?a:r,d=!!s.prerelease.length,u=!!l.prerelease.length;if(u&&!d){if(!l.patch&&!l.minor)return"major";if(0===l.compareMain(s))return l.minor&&!l.patch?"minor":"patch"}let c=d?"pre":"";return r.major!==a.major?c+"major":r.minor!==a.minor?c+"minor":r.patch!==a.patch?c+"patch":"prerelease"}},16918:(e,t,r)=>{let n=r(41890);e.exports=(e,t,r)=>0===n(e,t,r)},50222:(e,t,r)=>{let n=r(41890);e.exports=(e,t,r)=>n(e,t,r)>0},33053:(e,t,r)=>{let n=r(41890);e.exports=(e,t,r)=>n(e,t,r)>=0},60276:(e,t,r)=>{let n=r(66956);e.exports=(e,t,r,a,i)=>{"string"==typeof r&&(i=a,a=r,r=void 0);try{return new n(e instanceof n?e.version:e,r).inc(t,a,i).version}catch(e){return null}}},66984:(e,t,r)=>{let n=r(41890);e.exports=(e,t,r)=>0>n(e,t,r)},28967:(e,t,r)=>{let n=r(41890);e.exports=(e,t,r)=>0>=n(e,t,r)},45408:(e,t,r)=>{let n=r(66956);e.exports=(e,t)=>new n(e,t).major},48462:(e,t,r)=>{let n=r(66956);e.exports=(e,t)=>new n(e,t).minor},85917:(e,t,r)=>{let n=r(41890);e.exports=(e,t,r)=>0!==n(e,t,r)},4469:(e,t,r)=>{let n=r(66956);e.exports=(e,t,r=!1)=>{if(e instanceof n)return e;try{return new n(e,t)}catch(e){if(!r)return null;throw e}}},95065:(e,t,r)=>{let n=r(66956);e.exports=(e,t)=>new n(e,t).patch},98097:(e,t,r)=>{let n=r(4469);e.exports=(e,t)=>{let r=n(e,t);return r&&r.prerelease.length?r.prerelease:null}},75461:(e,t,r)=>{let n=r(41890);e.exports=(e,t,r)=>n(t,e,r)},61835:(e,t,r)=>{let n=r(51655);e.exports=(e,t)=>e.sort((e,r)=>n(r,e,t))},11190:(e,t,r)=>{let n=r(53703);e.exports=(e,t,r)=>{try{t=new n(t,r)}catch(e){return!1}return t.test(e)}},83082:(e,t,r)=>{let n=r(51655);e.exports=(e,t)=>e.sort((e,r)=>n(e,r,t))},99525:(e,t,r)=>{let n=r(4469);e.exports=(e,t)=>{let r=n(e,t);return r?r.version:null}},40342:(e,t,r)=>{let n=r(82652),a=r(53160),i=r(66956),o=r(21974),s=r(4469),l=r(99525),d=r(95967),u=r(60276),c=r(68837),p=r(45408),y=r(48462),m=r(95065),h=r(98097),f=r(41890),b=r(75461),K=r(85518),g=r(51655),v=r(83082),I=r(61835),E=r(50222),S=r(66984),j=r(16918),k=r(85917),x=r(33053),w=r(28967),T=r(1393),D=r(80686),O=r(94720),A=r(53703),R=r(11190),P=r(79288),C=r(59896),M=r(86518),_=r(92078),J=r(52801),L=r(81955),N=r(61649),F=r(12569),V=r(874),q=r(39754),G=r(11900);e.exports={parse:s,valid:l,clean:d,inc:u,diff:c,major:p,minor:y,patch:m,prerelease:h,compare:f,rcompare:b,compareLoose:K,compareBuild:g,sort:v,rsort:I,gt:E,lt:S,eq:j,neq:k,gte:x,lte:w,cmp:T,coerce:D,Comparator:O,Range:A,satisfies:R,toComparators:P,maxSatisfying:C,minSatisfying:M,minVersion:_,validRange:J,outside:L,gtr:N,ltr:F,intersects:V,simplifyRange:q,subset:G,SemVer:i,re:n.re,src:n.src,tokens:n.t,SEMVER_SPEC_VERSION:a.SEMVER_SPEC_VERSION,RELEASE_TYPES:a.RELEASE_TYPES,compareIdentifiers:o.compareIdentifiers,rcompareIdentifiers:o.rcompareIdentifiers}},53160:e=>{let t=Number.MAX_SAFE_INTEGER||9007199254740991;e.exports={MAX_LENGTH:256,MAX_SAFE_COMPONENT_LENGTH:16,MAX_SAFE_BUILD_LENGTH:250,MAX_SAFE_INTEGER:t,RELEASE_TYPES:["major","premajor","minor","preminor","patch","prepatch","prerelease"],SEMVER_SPEC_VERSION:"2.0.0",FLAG_INCLUDE_PRERELEASE:1,FLAG_LOOSE:2}},22274:e=>{let t="object"==typeof process&&process.env&&process.env.NODE_DEBUG&&/\bsemver\b/i.test(process.env.NODE_DEBUG)?(...e)=>console.error("SEMVER",...e):()=>{};e.exports=t},21974:e=>{let t=/^[0-9]+$/,compareIdentifiers=(e,r)=>{if("number"==typeof e&&"number"==typeof r)return e===r?0:e<r?-1:1;let n=t.test(e),a=t.test(r);return n&&a&&(e=+e,r=+r),e===r?0:n&&!a?-1:a&&!n?1:e<r?-1:1};e.exports={compareIdentifiers,rcompareIdentifiers:(e,t)=>compareIdentifiers(t,e)}},81408:e=>{e.exports=class{constructor(){this.max=1e3,this.map=new Map}get(e){let t=this.map.get(e);if(void 0!==t)return this.map.delete(e),this.map.set(e,t),t}delete(e){return this.map.delete(e)}set(e,t){let r=this.delete(e);if(!r&&void 0!==t){if(this.map.size>=this.max){let e=this.map.keys().next().value;this.delete(e)}this.map.set(e,t)}return this}}},66152:e=>{let t=Object.freeze({loose:!0}),r=Object.freeze({});e.exports=e=>e?"object"!=typeof e?t:e:r},82652:(e,t,r)=>{let{MAX_SAFE_COMPONENT_LENGTH:n,MAX_SAFE_BUILD_LENGTH:a,MAX_LENGTH:i}=r(53160),o=r(22274);t=e.exports={};let s=t.re=[],l=t.safeRe=[],d=t.src=[],u=t.safeSrc=[],c=t.t={},p=0,y="[a-zA-Z0-9-]",m=[["\\s",1],["\\d",i],[y,a]],makeSafeRegex=e=>{for(let[t,r]of m)e=e.split(`${t}*`).join(`${t}{0,${r}}`).split(`${t}+`).join(`${t}{1,${r}}`);return e},createToken=(e,t,r)=>{let n=makeSafeRegex(t),a=p++;o(e,a,t),c[e]=a,d[a]=t,u[a]=n,s[a]=new RegExp(t,r?"g":void 0),l[a]=new RegExp(n,r?"g":void 0)};createToken("NUMERICIDENTIFIER","0|[1-9]\\d*"),createToken("NUMERICIDENTIFIERLOOSE","\\d+"),createToken("NONNUMERICIDENTIFIER",`\\d*[a-zA-Z-]${y}*`),createToken("MAINVERSION",`(${d[c.NUMERICIDENTIFIER]})\\.(${d[c.NUMERICIDENTIFIER]})\\.(${d[c.NUMERICIDENTIFIER]})`),createToken("MAINVERSIONLOOSE",`(${d[c.NUMERICIDENTIFIERLOOSE]})\\.(${d[c.NUMERICIDENTIFIERLOOSE]})\\.(${d[c.NUMERICIDENTIFIERLOOSE]})`),createToken("PRERELEASEIDENTIFIER",`(?:${d[c.NONNUMERICIDENTIFIER]}|${d[c.NUMERICIDENTIFIER]})`),createToken("PRERELEASEIDENTIFIERLOOSE",`(?:${d[c.NONNUMERICIDENTIFIER]}|${d[c.NUMERICIDENTIFIERLOOSE]})`),createToken("PRERELEASE",`(?:-(${d[c.PRERELEASEIDENTIFIER]}(?:\\.${d[c.PRERELEASEIDENTIFIER]})*))`),createToken("PRERELEASELOOSE",`(?:-?(${d[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${d[c.PRERELEASEIDENTIFIERLOOSE]})*))`),createToken("BUILDIDENTIFIER",`${y}+`),createToken("BUILD",`(?:\\+(${d[c.BUILDIDENTIFIER]}(?:\\.${d[c.BUILDIDENTIFIER]})*))`),createToken("FULLPLAIN",`v?${d[c.MAINVERSION]}${d[c.PRERELEASE]}?${d[c.BUILD]}?`),createToken("FULL",`^${d[c.FULLPLAIN]}$`),createToken("LOOSEPLAIN",`[v=\\s]*${d[c.MAINVERSIONLOOSE]}${d[c.PRERELEASELOOSE]}?${d[c.BUILD]}?`),createToken("LOOSE",`^${d[c.LOOSEPLAIN]}$`),createToken("GTLT","((?:<|>)?=?)"),createToken("XRANGEIDENTIFIERLOOSE",`${d[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`),createToken("XRANGEIDENTIFIER",`${d[c.NUMERICIDENTIFIER]}|x|X|\\*`),createToken("XRANGEPLAIN",`[v=\\s]*(${d[c.XRANGEIDENTIFIER]})(?:\\.(${d[c.XRANGEIDENTIFIER]})(?:\\.(${d[c.XRANGEIDENTIFIER]})(?:${d[c.PRERELEASE]})?${d[c.BUILD]}?)?)?`),createToken("XRANGEPLAINLOOSE",`[v=\\s]*(${d[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${d[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${d[c.XRANGEIDENTIFIERLOOSE]})(?:${d[c.PRERELEASELOOSE]})?${d[c.BUILD]}?)?)?`),createToken("XRANGE",`^${d[c.GTLT]}\\s*${d[c.XRANGEPLAIN]}$`),createToken("XRANGELOOSE",`^${d[c.GTLT]}\\s*${d[c.XRANGEPLAINLOOSE]}$`),createToken("COERCEPLAIN",`(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`),createToken("COERCE",`${d[c.COERCEPLAIN]}(?:$|[^\\d])`),createToken("COERCEFULL",d[c.COERCEPLAIN]+`(?:${d[c.PRERELEASE]})?`+`(?:${d[c.BUILD]})?`+"(?:$|[^\\d])"),createToken("COERCERTL",d[c.COERCE],!0),createToken("COERCERTLFULL",d[c.COERCEFULL],!0),createToken("LONETILDE","(?:~>?)"),createToken("TILDETRIM",`(\\s*)${d[c.LONETILDE]}\\s+`,!0),t.tildeTrimReplace="$1~",createToken("TILDE",`^${d[c.LONETILDE]}${d[c.XRANGEPLAIN]}$`),createToken("TILDELOOSE",`^${d[c.LONETILDE]}${d[c.XRANGEPLAINLOOSE]}$`),createToken("LONECARET","(?:\\^)"),createToken("CARETTRIM",`(\\s*)${d[c.LONECARET]}\\s+`,!0),t.caretTrimReplace="$1^",createToken("CARET",`^${d[c.LONECARET]}${d[c.XRANGEPLAIN]}$`),createToken("CARETLOOSE",`^${d[c.LONECARET]}${d[c.XRANGEPLAINLOOSE]}$`),createToken("COMPARATORLOOSE",`^${d[c.GTLT]}\\s*(${d[c.LOOSEPLAIN]})$|^$`),createToken("COMPARATOR",`^${d[c.GTLT]}\\s*(${d[c.FULLPLAIN]})$|^$`),createToken("COMPARATORTRIM",`(\\s*)${d[c.GTLT]}\\s*(${d[c.LOOSEPLAIN]}|${d[c.XRANGEPLAIN]})`,!0),t.comparatorTrimReplace="$1$2$3",createToken("HYPHENRANGE",`^\\s*(${d[c.XRANGEPLAIN]})\\s+-\\s+(${d[c.XRANGEPLAIN]})\\s*$`),createToken("HYPHENRANGELOOSE",`^\\s*(${d[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${d[c.XRANGEPLAINLOOSE]})\\s*$`),createToken("STAR","(<|>)?=?\\s*\\*"),createToken("GTE0","^\\s*>=\\s*0\\.0\\.0\\s*$"),createToken("GTE0PRE","^\\s*>=\\s*0\\.0\\.0-0\\s*$")},61649:(e,t,r)=>{let n=r(81955);e.exports=(e,t,r)=>n(e,t,">",r)},874:(e,t,r)=>{let n=r(53703);e.exports=(e,t,r)=>(e=new n(e,r),t=new n(t,r),e.intersects(t,r))},12569:(e,t,r)=>{let n=r(81955);e.exports=(e,t,r)=>n(e,t,"<",r)},59896:(e,t,r)=>{let n=r(66956),a=r(53703);e.exports=(e,t,r)=>{let i=null,o=null,s=null;try{s=new a(t,r)}catch(e){return null}return e.forEach(e=>{s.test(e)&&(!i||-1===o.compare(e))&&(i=e,o=new n(i,r))}),i}},86518:(e,t,r)=>{let n=r(66956),a=r(53703);e.exports=(e,t,r)=>{let i=null,o=null,s=null;try{s=new a(t,r)}catch(e){return null}return e.forEach(e=>{s.test(e)&&(!i||1===o.compare(e))&&(i=e,o=new n(i,r))}),i}},92078:(e,t,r)=>{let n=r(66956),a=r(53703),i=r(50222);e.exports=(e,t)=>{e=new a(e,t);let r=new n("0.0.0");if(e.test(r)||(r=new n("0.0.0-0"),e.test(r)))return r;r=null;for(let t=0;t<e.set.length;++t){let a=e.set[t],o=null;a.forEach(e=>{let t=new n(e.semver.version);switch(e.operator){case">":0===t.prerelease.length?t.patch++:t.prerelease.push(0),t.raw=t.format();case"":case">=":(!o||i(t,o))&&(o=t);break;case"<":case"<=":break;default:throw Error(`Unexpected operation: ${e.operator}`)}}),o&&(!r||i(r,o))&&(r=o)}return r&&e.test(r)?r:null}},81955:(e,t,r)=>{let n=r(66956),a=r(94720),{ANY:i}=a,o=r(53703),s=r(11190),l=r(50222),d=r(66984),u=r(28967),c=r(33053);e.exports=(e,t,r,p)=>{let y,m,h,f,b;switch(e=new n(e,p),t=new o(t,p),r){case">":y=l,m=u,h=d,f=">",b=">=";break;case"<":y=d,m=c,h=l,f="<",b="<=";break;default:throw TypeError('Must provide a hilo val of "<" or ">"')}if(s(e,t,p))return!1;for(let r=0;r<t.set.length;++r){let n=t.set[r],o=null,s=null;if(n.forEach(e=>{e.semver===i&&(e=new a(">=0.0.0")),o=o||e,s=s||e,y(e.semver,o.semver,p)?o=e:h(e.semver,s.semver,p)&&(s=e)}),o.operator===f||o.operator===b||(!s.operator||s.operator===f)&&m(e,s.semver)||s.operator===b&&h(e,s.semver))return!1}return!0}},39754:(e,t,r)=>{let n=r(11190),a=r(41890);e.exports=(e,t,r)=>{let i=[],o=null,s=null,l=e.sort((e,t)=>a(e,t,r));for(let e of l){let a=n(e,t,r);a?(s=e,o||(o=e)):(s&&i.push([o,s]),s=null,o=null)}o&&i.push([o,null]);let d=[];for(let[e,t]of i)e===t?d.push(e):t||e!==l[0]?t?e===l[0]?d.push(`<=${t}`):d.push(`${e} - ${t}`):d.push(`>=${e}`):d.push("*");let u=d.join(" || "),c="string"==typeof t.raw?t.raw:String(t);return u.length<c.length?u:t}},11900:(e,t,r)=>{let n=r(53703),a=r(94720),{ANY:i}=a,o=r(11190),s=r(41890),l=[new a(">=0.0.0-0")],d=[new a(">=0.0.0")],simpleSubset=(e,t,r)=>{let n,a,u,c,p,y,m;if(e===t)return!0;if(1===e.length&&e[0].semver===i){if(1===t.length&&t[0].semver===i)return!0;e=r.includePrerelease?l:d}if(1===t.length&&t[0].semver===i){if(r.includePrerelease)return!0;t=d}let h=new Set;for(let t of e)">"===t.operator||">="===t.operator?n=higherGT(n,t,r):"<"===t.operator||"<="===t.operator?a=lowerLT(a,t,r):h.add(t.semver);if(h.size>1||n&&a&&((u=s(n.semver,a.semver,r))>0||0===u&&(">="!==n.operator||"<="!==a.operator)))return null;for(let e of h){if(n&&!o(e,String(n),r)||a&&!o(e,String(a),r))return null;for(let n of t)if(!o(e,String(n),r))return!1;return!0}let f=!!a&&!r.includePrerelease&&!!a.semver.prerelease.length&&a.semver,b=!!n&&!r.includePrerelease&&!!n.semver.prerelease.length&&n.semver;for(let e of(f&&1===f.prerelease.length&&"<"===a.operator&&0===f.prerelease[0]&&(f=!1),t)){if(m=m||">"===e.operator||">="===e.operator,y=y||"<"===e.operator||"<="===e.operator,n){if(b&&e.semver.prerelease&&e.semver.prerelease.length&&e.semver.major===b.major&&e.semver.minor===b.minor&&e.semver.patch===b.patch&&(b=!1),">"===e.operator||">="===e.operator){if((c=higherGT(n,e,r))===e&&c!==n)return!1}else if(">="===n.operator&&!o(n.semver,String(e),r))return!1}if(a){if(f&&e.semver.prerelease&&e.semver.prerelease.length&&e.semver.major===f.major&&e.semver.minor===f.minor&&e.semver.patch===f.patch&&(f=!1),"<"===e.operator||"<="===e.operator){if((p=lowerLT(a,e,r))===e&&p!==a)return!1}else if("<="===a.operator&&!o(a.semver,String(e),r))return!1}if(!e.operator&&(a||n)&&0!==u)return!1}return(!n||!y||!!a||0===u)&&(!a||!m||!!n||0===u)&&!b&&!f},higherGT=(e,t,r)=>{if(!e)return t;let n=s(e.semver,t.semver,r);return n>0?e:n<0?t:">"===t.operator&&">="===e.operator?t:e},lowerLT=(e,t,r)=>{if(!e)return t;let n=s(e.semver,t.semver,r);return n<0?e:n>0?t:"<"===t.operator&&"<="===e.operator?t:e};e.exports=(e,t,r={})=>{if(e===t)return!0;e=new n(e,r),t=new n(t,r);let a=!1;e:for(let n of e.set){for(let e of t.set){let t=simpleSubset(n,e,r);if(a=a||null!==t,t)continue e}if(a)return!1}return!0}},79288:(e,t,r)=>{let n=r(53703);e.exports=(e,t)=>new n(e,t).set.map(e=>e.map(e=>e.value).join(" ").trim().split(" "))},52801:(e,t,r)=>{let n=r(53703);e.exports=(e,t)=>{try{return new n(e,t).range||"*"}catch(e){return null}}},7224:(e,t,r)=>{let n,a,i,o,s,l,d,u,c,p,y,m;var h,f,b,K,g,v,I,E,S,j,k,x=r(12781);r(98188);try{h=new TextDecoder}catch(e){}var w=0;let T=[];var D=T,O=0,A={},R=0,P=0,C=[],M={useRecords:!1,mapsAsObjects:!0};let C1Type=class C1Type{};let _=new C1Type;_.name="MessagePack 0xC1";var J=!1,L=2;try{Function("")}catch(e){L=1/0}let Unpackr=class Unpackr{constructor(e){e&&(!1===e.useRecords&&void 0===e.mapsAsObjects&&(e.mapsAsObjects=!0),!e.sequential||!1===e.trusted||(e.trusted=!0,e.structures||!1==e.useRecords||(e.structures=[],e.maxSharedStructures||(e.maxSharedStructures=0))),e.structures?e.structures.sharedLength=e.structures.length:e.getStructures&&((e.structures=[]).uninitialized=!0,e.structures.sharedLength=0),e.int64AsNumber&&(e.int64AsType="number")),Object.assign(this,e)}unpack(e,t){if(f)return saveState$1(()=>(clearSource(),this?this.unpack(e,t):Unpackr.prototype.unpack.call(M,e,t)));e.buffer||e.constructor!==ArrayBuffer||(e="undefined"!=typeof Buffer?Buffer.from(e):new Uint8Array(e)),"object"==typeof t?(b=t.end||e.length,w=t.start||0):(w=0,b=t>-1?t:e.length),O=0,P=0,g=null,D=T,v=null,f=e;try{E=e.dataView||(e.dataView=new DataView(e.buffer,e.byteOffset,e.byteLength))}catch(t){if(f=null,e instanceof Uint8Array)throw t;throw Error("Source must be a Uint8Array or Buffer but was a "+(e&&"object"==typeof e?e.constructor.name:typeof e))}return this instanceof Unpackr?(A=this,this.structures?K=this.structures:(!K||K.length>0)&&(K=[])):(A=M,(!K||K.length>0)&&(K=[])),checkedRead(t)}unpackMultiple(e,t){let r,n=0;try{J=!0;let a=e.length,i=this?this.unpack(e,a):B.unpack(e,a);if(t){if(!1===t(i,n,w))return;for(;w<a;)if(n=w,!1===t(checkedRead(),n,w))return}else{for(r=[i];w<a;)n=w,r.push(checkedRead());return r}}catch(e){throw e.lastPosition=n,e.values=r,e}finally{J=!1,clearSource()}}_mergeStructures(e,t){j&&(e=j.call(this,e)),Object.isFrozen(e=e||[])&&(e=e.map(e=>e.slice(0)));for(let t=0,r=e.length;t<r;t++){let r=e[t];r&&(r.isShared=!0,t>=32&&(r.highByte=t-32>>5))}for(let r in e.sharedLength=e.length,t||[])if(r>=0){let n=e[r],a=t[r];a&&(n&&((e.restoreStructures||(e.restoreStructures=[]))[r]=n),e[r]=a)}return this.structures=e}decode(e,t){return this.unpack(e,t)}};function checkedRead(e){try{let t;if(!A.trusted&&!J){let e=K.sharedLength||0;e<K.length&&(K.length=e)}if(A.randomAccessStructure&&f[w]<64&&f[w]>=32&&S?(t=S(f,w,b,A),f=null,!(e&&e.lazy)&&t&&(t=t.toJSON()),w=b):t=read(),v&&(w=v.postBundlePosition,v=null),J&&(K.restoreStructures=null),w==b)K&&K.restoreStructures&&restoreStructures(),K=null,f=null,I&&(I=null);else if(w>b)throw Error("Unexpected end of MessagePack data");else if(!J){let e;try{e=JSON.stringify(t,(e,t)=>"bigint"==typeof t?`${t}n`:t).slice(0,100)}catch(t){e="(JSON view not available "+t+")"}throw Error("Data read, but end of buffer not reached "+e)}return t}catch(e){throw K&&K.restoreStructures&&restoreStructures(),clearSource(),(e instanceof RangeError||e.message.startsWith("Unexpected end of buffer")||w>b)&&(e.incomplete=!0),e}}function restoreStructures(){for(let e in K.restoreStructures)K[e]=K.restoreStructures[e];K.restoreStructures=null}function read(){let e=f[w++];if(e<160){if(e<128){if(e<64)return e;{let t=K[63&e]||A.getStructures&&loadStructures()[63&e];return t?(t.read||(t.read=createStructureReader(t,63&e)),t.read()):e}}if(e<144){if(e-=128,A.mapsAsObjects){let t={};for(let r=0;r<e;r++){let e=readKey();"__proto__"===e&&(e="__proto_"),t[e]=read()}return t}{let t=new Map;for(let r=0;r<e;r++)t.set(read(),read());return t}}{let t=Array(e-=144);for(let r=0;r<e;r++)t[r]=read();return A.freezeData?Object.freeze(t):t}}if(e<192){let t=e-160;if(P>=w)return g.slice(w-R,(w+=t)-R);if(0==P&&b<140){let e=t<16?shortStringInJS(t):longStringInJS(t);if(null!=e)return e}return F(t)}{let t;switch(e){case 192:return null;case 193:if(v){if((t=read())>0)return v[1].slice(v.position1,v.position1+=t);return v[0].slice(v.position0,v.position0-=t)}return _;case 194:return!1;case 195:return!0;case 196:if(void 0===(t=f[w++]))throw Error("Unexpected end of buffer");return readBin(t);case 197:return t=E.getUint16(w),w+=2,readBin(t);case 198:return t=E.getUint32(w),w+=4,readBin(t);case 199:return readExt(f[w++]);case 200:return t=E.getUint16(w),w+=2,readExt(t);case 201:return t=E.getUint32(w),w+=4,readExt(t);case 202:if(t=E.getFloat32(w),A.useFloat32>2){let e=H[(127&f[w])<<1|f[w+1]>>7];return w+=4,(e*t+(t>0?.5:-.5)>>0)/e}return w+=4,t;case 203:return t=E.getFloat64(w),w+=8,t;case 204:return f[w++];case 205:return t=E.getUint16(w),w+=2,t;case 206:return t=E.getUint32(w),w+=4,t;case 207:return"number"===A.int64AsType?t=4294967296*E.getUint32(w)+E.getUint32(w+4):"string"===A.int64AsType?t=E.getBigUint64(w).toString():"auto"===A.int64AsType?(t=E.getBigUint64(w))<=BigInt(2)<<BigInt(52)&&(t=Number(t)):t=E.getBigUint64(w),w+=8,t;case 208:return E.getInt8(w++);case 209:return t=E.getInt16(w),w+=2,t;case 210:return t=E.getInt32(w),w+=4,t;case 211:return"number"===A.int64AsType?t=4294967296*E.getInt32(w)+E.getUint32(w+4):"string"===A.int64AsType?t=E.getBigInt64(w).toString():"auto"===A.int64AsType?(t=E.getBigInt64(w))>=BigInt(-2)<<BigInt(52)&&t<=BigInt(2)<<BigInt(52)&&(t=Number(t)):t=E.getBigInt64(w),w+=8,t;case 212:if(114==(t=f[w++]))return recordDefinition(63&f[w++]);{let e=C[t];if(e){if(e.read)return w++,e.read(read());if(e.noBuffer)return w++,e();return e(f.subarray(w,++w))}throw Error("Unknown extension "+t)}case 213:if(114==(t=f[w]))return w++,recordDefinition(63&f[w++],f[w++]);return readExt(2);case 214:return readExt(4);case 215:return readExt(8);case 216:return readExt(16);case 217:if(t=f[w++],P>=w)return g.slice(w-R,(w+=t)-R);return V(t);case 218:if(t=E.getUint16(w),w+=2,P>=w)return g.slice(w-R,(w+=t)-R);return q(t);case 219:if(t=E.getUint32(w),w+=4,P>=w)return g.slice(w-R,(w+=t)-R);return G(t);case 220:return t=E.getUint16(w),w+=2,readArray(t);case 221:return t=E.getUint32(w),w+=4,readArray(t);case 222:return t=E.getUint16(w),w+=2,readMap(t);case 223:return t=E.getUint32(w),w+=4,readMap(t);default:if(e>=224)return e-256;if(void 0===e){let e=Error("Unexpected end of MessagePack data");throw e.incomplete=!0,e}throw Error("Unknown MessagePack token "+e)}}}let N=/^[a-zA-Z_$][a-zA-Z\d_$]*$/;function createStructureReader(e,t){function readObject(){if(readObject.count++>L){let r=e.read=Function("r","return function(){return "+(A.freezeData?"Object.freeze":"")+"({"+e.map(e=>"__proto__"===e?"__proto_:r()":N.test(e)?e+":r()":"["+JSON.stringify(e)+"]:r()").join(",")+"})}")(read);return 0===e.highByte&&(e.read=createSecondByteReader(t,e.read)),r()}let r={};for(let t=0,n=e.length;t<n;t++){let n=e[t];"__proto__"===n&&(n="__proto_"),r[n]=read()}return A.freezeData?Object.freeze(r):r}return(readObject.count=0,0===e.highByte)?createSecondByteReader(t,readObject):readObject}let createSecondByteReader=(e,t)=>function(){let r=f[w++];if(0===r)return t();let n=e<32?-(e+(r<<5)):e+(r<<5),a=K[n]||loadStructures()[n];if(!a)throw Error("Record id is not defined for "+n);return a.read||(a.read=createStructureReader(a,e)),a.read()};function loadStructures(){let e=saveState$1(()=>(f=null,A.getStructures()));return K=A._mergeStructures(e,K)}var F=readStringJS,V=readStringJS,q=readStringJS,G=readStringJS;function readStringJS(e){let t;if(e<16&&(t=shortStringInJS(e)))return t;if(e>64&&h)return h.decode(f.subarray(w,w+=e));let r=w+e,n=[];for(t="";w<r;){let e=f[w++];if((128&e)==0)n.push(e);else if((224&e)==192){let t=63&f[w++];n.push((31&e)<<6|t)}else if((240&e)==224){let t=63&f[w++],r=63&f[w++];n.push((31&e)<<12|t<<6|r)}else if((248&e)==240){let t=63&f[w++],r=63&f[w++],a=63&f[w++],i=(7&e)<<18|t<<12|r<<6|a;i>65535&&(i-=65536,n.push(i>>>10&1023|55296),i=56320|1023&i),n.push(i)}else n.push(e);n.length>=4096&&(t+=Y.apply(String,n),n.length=0)}return n.length>0&&(t+=Y.apply(String,n)),t}function readArray(e){let t=Array(e);for(let r=0;r<e;r++)t[r]=read();return A.freezeData?Object.freeze(t):t}function readMap(e){if(A.mapsAsObjects){let t={};for(let r=0;r<e;r++){let e=readKey();"__proto__"===e&&(e="__proto_"),t[e]=read()}return t}{let t=new Map;for(let r=0;r<e;r++)t.set(read(),read());return t}}t.isNativeAccelerationEnabled=!1;var Y=String.fromCharCode;function longStringInJS(e){let t=w,r=Array(e);for(let n=0;n<e;n++){let e=f[w++];if((128&e)>0){w=t;return}r[n]=e}return Y.apply(String,r)}function shortStringInJS(e){if(e<4){if(e<2){if(0===e)return"";{let e=f[w++];if((128&e)>1){w-=1;return}return Y(e)}}{let t=f[w++],r=f[w++];if((128&t)>0||(128&r)>0){w-=2;return}if(e<3)return Y(t,r);let n=f[w++];if((128&n)>0){w-=3;return}return Y(t,r,n)}}{let t=f[w++],r=f[w++],n=f[w++],a=f[w++];if((128&t)>0||(128&r)>0||(128&n)>0||(128&a)>0){w-=4;return}if(e<6){if(4===e)return Y(t,r,n,a);{let e=f[w++];if((128&e)>0){w-=5;return}return Y(t,r,n,a,e)}}if(e<8){let i=f[w++],o=f[w++];if((128&i)>0||(128&o)>0){w-=6;return}if(e<7)return Y(t,r,n,a,i,o);let s=f[w++];if((128&s)>0){w-=7;return}return Y(t,r,n,a,i,o,s)}{let i=f[w++],o=f[w++],s=f[w++],l=f[w++];if((128&i)>0||(128&o)>0||(128&s)>0||(128&l)>0){w-=8;return}if(e<10){if(8===e)return Y(t,r,n,a,i,o,s,l);{let e=f[w++];if((128&e)>0){w-=9;return}return Y(t,r,n,a,i,o,s,l,e)}}if(e<12){let d=f[w++],u=f[w++];if((128&d)>0||(128&u)>0){w-=10;return}if(e<11)return Y(t,r,n,a,i,o,s,l,d,u);let c=f[w++];if((128&c)>0){w-=11;return}return Y(t,r,n,a,i,o,s,l,d,u,c)}{let d=f[w++],u=f[w++],c=f[w++],p=f[w++];if((128&d)>0||(128&u)>0||(128&c)>0||(128&p)>0){w-=12;return}if(e<14){if(12===e)return Y(t,r,n,a,i,o,s,l,d,u,c,p);{let e=f[w++];if((128&e)>0){w-=13;return}return Y(t,r,n,a,i,o,s,l,d,u,c,p,e)}}{let y=f[w++],m=f[w++];if((128&y)>0||(128&m)>0){w-=14;return}if(e<15)return Y(t,r,n,a,i,o,s,l,d,u,c,p,y,m);let h=f[w++];if((128&h)>0){w-=15;return}return Y(t,r,n,a,i,o,s,l,d,u,c,p,y,m,h)}}}}}function readOnlyJSString(){let e,t=f[w++];if(t<192)e=t-160;else switch(t){case 217:e=f[w++];break;case 218:e=E.getUint16(w),w+=2;break;case 219:e=E.getUint32(w),w+=4;break;default:throw Error("Expected string")}return readStringJS(e)}function readBin(e){return A.copyBuffers?Uint8Array.prototype.slice.call(f,w,w+=e):f.subarray(w,w+=e)}function readExt(e){let t=f[w++];if(C[t]){let r;return C[t](f.subarray(w,r=w+=e),e=>{w=e;try{return read()}finally{w=r}})}throw Error("Unknown extension type "+t)}var W=Array(4096);function readKey(){let e,t=f[w++];if(!(t>=160)||!(t<192))return w--,asSafeString(read());if(t-=160,P>=w)return g.slice(w-R,(w+=t)-R);if(!(0==P&&b<180))return F(t);let r=(t<<5^(t>1?E.getUint16(w):t>0?f[w]:0))&4095,n=W[r],a=w,i=w+t-3,o=0;if(n&&n.bytes==t){for(;a<i;){if((e=E.getUint32(a))!=n[o++]){a=1879048192;break}a+=4}for(i+=3;a<i;)if((e=f[a++])!=n[o++]){a=1879048192;break}if(a===i)return w=a,n.string;i-=3,a=w}for(n=[],W[r]=n,n.bytes=t;a<i;)e=E.getUint32(a),n.push(e),a+=4;for(i+=3;a<i;)e=f[a++],n.push(e);let s=t<16?shortStringInJS(t):longStringInJS(t);return null!=s?n.string=s:n.string=F(t)}function asSafeString(e){if("string"==typeof e)return e;if("number"==typeof e||"boolean"==typeof e||"bigint"==typeof e)return e.toString();if(null==e)return e+"";if(A.allowArraysInMapKeys&&Array.isArray(e)&&e.flat().every(e=>["string","number","boolean","bigint"].includes(typeof e)))return e.flat().toString();throw Error(`Invalid property type for record: ${typeof e}`)}let recordDefinition=(e,t)=>{let r=read().map(asSafeString),n=e;void 0!==t&&(e=e<32?-((t<<5)+e):(t<<5)+e,r.highByte=t);let a=K[e];return a&&(a.isShared||J)&&((K.restoreStructures||(K.restoreStructures=[]))[e]=a),K[e]=r,r.read=createStructureReader(r,n),r.read()};C[0]=()=>{},C[0].noBuffer=!0,C[66]=e=>{let t=e.byteLength%8||8,r=BigInt(128&e[0]?e[0]-256:e[0]);for(let n=1;n<t;n++)r<<=BigInt(8),r+=BigInt(e[n]);if(e.byteLength!==t){let n=new DataView(e.buffer,e.byteOffset,e.byteLength),decode=(e,t)=>{let r=t-e;if(r<=40){let r=n.getBigUint64(e);for(let a=e+8;a<t;a+=8)r<<=BigInt(64n),r|=n.getBigUint64(a);return r}let a=e+(r>>4<<3),i=decode(e,a),o=decode(a,t);return i<<BigInt((t-a)*8)|o};r=r<<BigInt((n.byteLength-t)*8)|decode(t,n.byteLength)}return r};let U={Error,EvalError,RangeError,ReferenceError,SyntaxError,TypeError,URIError,AggregateError:"function"==typeof AggregateError?AggregateError:null};C[101]=()=>{let e=read();if(!U[e[0]]){let t=Error(e[1],{cause:e[2]});return t.name=e[0],t}return U[e[0]](e[1],{cause:e[2]})},C[105]=e=>{let t;if(!1===A.structuredClone)throw Error("Structured clone extension is disabled");let r=E.getUint32(w-4);I||(I=new Map);let n=f[w],a={target:t=n>=144&&n<160||220==n||221==n?[]:n>=128&&n<144||222==n||223==n?new Map:(n>=199&&n<=201||n>=212&&n<=216)&&115===f[w+1]?new Set:{}};I.set(r,a);let i=read();if(!a.used)return a.target=i;if(Object.assign(t,i),t instanceof Map)for(let[e,r]of i.entries())t.set(e,r);if(t instanceof Set)for(let e of Array.from(i))t.add(e);return t},C[112]=e=>{if(!1===A.structuredClone)throw Error("Structured clone extension is disabled");let t=E.getUint32(w-4),r=I.get(t);return r.used=!0,r.target},C[115]=()=>new Set(read());let $=["Int8","Uint8","Uint8Clamped","Int16","Uint16","Int32","Uint32","Float32","Float64","BigInt64","BigUint64"].map(e=>e+"Array"),Z="object"==typeof globalThis?globalThis:window;C[116]=e=>{let t=e[0],r=Uint8Array.prototype.slice.call(e,1).buffer,n=$[t];if(!n){if(16===t)return r;if(17===t)return new DataView(r);throw Error("Could not find typed array for code "+t)}return new Z[n](r)},C[120]=()=>{let e=read();return new RegExp(e[0],e[1])};let z=[];function saveState$1(e){k&&k();let t=b,r=w,n=O,a=R,i=P,o=g,s=D,l=I,d=v,u=new Uint8Array(f.slice(0,b)),c=K,p=K.slice(0,K.length),y=A,m=J,h=e();return b=t,w=r,O=n,R=a,P=i,g=o,D=s,I=l,v=d,f=u,J=m,(K=c).splice(0,K.length,...p),A=y,E=new DataView(f.buffer,f.byteOffset,f.byteLength),h}function clearSource(){f=null,I=null,K=null}C[98]=e=>{let t=(e[0]<<24)+(e[1]<<16)+(e[2]<<8)+e[3],r=w;return w+=t-e.length,v=z,(v=[readOnlyJSString(),readOnlyJSString()]).position0=0,v.position1=0,v.postBundlePosition=w,w=r,read()},C[255]=e=>new Date(4==e.length?(16777216*e[0]+(e[1]<<16)+(e[2]<<8)+e[3])*1e3:8==e.length?((e[0]<<22)+(e[1]<<14)+(e[2]<<6)+(e[3]>>2))/1e6+((3&e[3])*4294967296+16777216*e[4]+(e[5]<<16)+(e[6]<<8)+e[7])*1e3:12==e.length?((e[0]<<24)+(e[1]<<16)+(e[2]<<8)+e[3])/1e6+((128&e[4]?-281474976710656:0)+1099511627776*e[6]+4294967296*e[7]+16777216*e[8]+(e[9]<<16)+(e[10]<<8)+e[11])*1e3:"invalid");let H=Array(147);for(let e=0;e<256;e++)H[e]=+("1e"+Math.floor(45.15-.30103*e));var B=new Unpackr({useRecords:!1});let X=B.unpack,Q=B.unpackMultiple,ee=B.unpack,et={NEVER:0,ALWAYS:1,DECIMAL_ROUND:3,DECIMAL_FIT:4},er=new Float32Array(1),en=new Uint8Array(er.buffer,0,4);try{n=new TextEncoder}catch(e){}let ea="undefined"!=typeof Buffer,ei=ea?function(e){return Buffer.allocUnsafeSlow(e)}:Uint8Array,eo=ea?Buffer:Uint8Array,es=ea?4294967296:2144337920,el=0,ed=null,eu=/[\u0080-\uFFFF]/,ec=Symbol("record-id");let Packr=class Packr extends Unpackr{constructor(e){let t,r,c,p;super(e),this.offset=0;let y=eo.prototype.utf8Write?function(e,t){return o.utf8Write(e,t,o.byteLength-t)}:!!n&&!!n.encodeInto&&function(e,t){return n.encodeInto(e,o.subarray(t)).written},m=this;e||(e={});let h=e&&e.sequential,f=e.structures||e.saveStructures,b=e.maxSharedStructures;if(null==b&&(b=f?32:0),b>8160)throw Error("Maximum maxSharedStructure is 8160");e.structuredClone&&void 0==e.moreTypes&&(this.moreTypes=!0);let K=e.maxOwnStructures;null==K&&(K=f?32:64),this.structures||!1==e.useRecords||(this.structures=[]);let g=b>32||K+b>64,v=b+64,I=b+K+64;if(I>8256)throw Error("Maximum maxSharedStructure + maxOwnStructure is 8192");let E=[],S=0,j=0;this.pack=this.encode=function(e,n){let a;if(o||(l=(o=new ei(8192)).dataView||(o.dataView=new DataView(o.buffer,0,8192)),el=0),(d=o.length-10)-el<2048?(l=(o=new ei(o.length)).dataView||(o.dataView=new DataView(o.buffer,0,o.length)),d=o.length-10,el=0):el=el+7&2147483640,t=el,n&eI&&(el+=255&n),p=m.structuredClone?new Map:null,m.bundleStrings&&"string"!=typeof e?(ed=[]).size=1/0:ed=null,c=m.structures){c.uninitialized&&(c=m._mergeStructures(m.getStructures()));let e=c.sharedLength||0;if(e>b)throw Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to "+c.sharedLength);if(!c.transitions){c.transitions=Object.create(null);for(let t=0;t<e;t++){let e=c[t];if(!e)continue;let r,n=c.transitions;for(let t=0,a=e.length;t<a;t++){let a=e[t];(r=n[a])||(r=n[a]=Object.create(null)),n=r}n[ec]=t+64}this.lastNamedStructuresLength=e}h||(c.nextId=e+64)}r&&(r=!1);try{m.randomAccessStructure&&e&&e.constructor&&e.constructor===Object?writeStruct(e):pack(e);let r=ed;if(ed&&writeBundles(t,pack,0),p&&p.idsToInsert){let e=p.idsToInsert.sort((e,t)=>e.offset>t.offset?1:-1),n=e.length,a=-1;for(;r&&n>0;){let i=e[--n].offset+t;i<r.stringsPosition+t&&-1===a&&(a=0),i>r.position+t?a>=0&&(a+=6):(a>=0&&(l.setUint32(r.position+t,l.getUint32(r.position+t)+a),a=-1),r=r.previous,n++)}a>=0&&r&&l.setUint32(r.position+t,l.getUint32(r.position+t)+a),(el+=6*e.length)>d&&makeRoom(el),m.offset=el;let i=function(e,t){let r;let n=6*t.length,a=e.length-n;for(;r=t.pop();){let t=r.offset,i=r.id;e.copyWithin(t+n,t,a);let o=t+(n-=6);e[o++]=214,e[o++]=105,e[o++]=i>>24,e[o++]=i>>16&255,e[o++]=i>>8&255,e[o++]=255&i,a=t}return e}(o.subarray(t,el),e);return p=null,i}if(m.offset=el,n&eg)return o.start=t,o.end=el,o;return o.subarray(t,el)}catch(e){throw a=e,e}finally{if(c&&(resetStructures(),r&&m.saveStructures)){let r=c.sharedLength||0,i=o.subarray(t,el),s=prepareStructures$1(c,m);if(!a){if(!1===m.saveStructures(s,s.isCompatible))return m.pack(e,n);return m.lastNamedStructuresLength=r,o.length>1073741824&&(o=null),i}}o.length>1073741824&&(o=null),n&ev&&(el=t)}};let resetStructures=()=>{j<10&&j++;let e=c.sharedLength||0;if(c.length>e&&!h&&(c.length=e),S>1e4)c.transitions=null,j=0,S=0,E.length>0&&(E=[]);else if(E.length>0&&!h){for(let e=0,t=E.length;e<t;e++)E[e][ec]=0;E=[]}},packArray=e=>{var t=e.length;t<16?o[el++]=144|t:t<65536?(o[el++]=220,o[el++]=t>>8,o[el++]=255&t):(o[el++]=221,l.setUint32(el,t),el+=4);for(let r=0;r<t;r++)pack(e[r])},pack=e=>{el>d&&(o=makeRoom(el));var r,n=typeof e;if("string"===n){let n,a=e.length;if(ed&&a>=4&&a<4096){if((ed.size+=a)>21760){let e,r;let n=(ed[0]?3*ed[0].length+ed[1].length:0)+10;el+n>d&&(o=makeRoom(el+n)),ed.position?(r=ed,o[el]=200,el+=3,o[el++]=98,e=el-t,el+=4,writeBundles(t,pack,0),l.setUint16(e+t-3,el-t-e)):(o[el++]=214,o[el++]=98,e=el-t,el+=4),(ed=["",""]).previous=r,ed.size=0,ed.position=e}let r=eu.test(e);ed[r?0:1]+=e,o[el++]=193,pack(r?-a:a);return}n=a<32?1:a<256?2:a<65536?3:5;let i=3*a;if(el+i>d&&(o=makeRoom(el+i)),a<64||!y){let t,i,s,l=el+n;for(t=0;t<a;t++)(i=e.charCodeAt(t))<128?o[l++]=i:(i<2048?o[l++]=i>>6|192:((64512&i)==55296&&(64512&(s=e.charCodeAt(t+1)))==56320?(i=65536+((1023&i)<<10)+(1023&s),t++,o[l++]=i>>18|240,o[l++]=i>>12&63|128):o[l++]=i>>12|224,o[l++]=i>>6&63|128),o[l++]=63&i|128);r=l-el-n}else r=y(e,el+n);r<32?o[el++]=160|r:r<256?(n<2&&o.copyWithin(el+2,el+1,el+1+r),o[el++]=217,o[el++]=r):r<65536?(n<3&&o.copyWithin(el+3,el+2,el+2+r),o[el++]=218,o[el++]=r>>8,o[el++]=255&r):(n<5&&o.copyWithin(el+5,el+3,el+3+r),o[el++]=219,l.setUint32(el,r),el+=4),el+=r}else if("number"===n){if(e>>>0===e)e<32||e<128&&!1===this.useRecords||e<64&&!this.randomAccessStructure?o[el++]=e:e<256?(o[el++]=204,o[el++]=e):e<65536?(o[el++]=205,o[el++]=e>>8,o[el++]=255&e):(o[el++]=206,l.setUint32(el,e),el+=4);else if(e>>0===e)e>=-32?o[el++]=256+e:e>=-128?(o[el++]=208,o[el++]=e+256):e>=-32768?(o[el++]=209,l.setInt16(el,e),el+=2):(o[el++]=210,l.setInt32(el,e),el+=4);else{let t;if((t=this.useFloat32)>0&&e<4294967296&&e>=-2147483648){let r;if(o[el++]=202,l.setFloat32(el,e),t<4||(r=e*H[(127&o[el])<<1|o[el+1]>>7])>>0===r){el+=4;return}el--}o[el++]=203,l.setFloat64(el,e),el+=8}}else if("object"===n||"function"===n){if(e){if(p){let r=p.get(e);if(r){if(!r.id){let e=p.idsToInsert||(p.idsToInsert=[]);r.id=e.push(r)}o[el++]=214,o[el++]=112,l.setUint32(el,r.id),el+=4;return}p.set(e,{offset:el-t})}let s=e.constructor;if(s===Object)T(e);else if(s===Array)packArray(e);else if(s===Map){if(this.mapAsEmptyObject)o[el++]=128;else for(let[t,n]of((r=e.size)<16?o[el++]=128|r:r<65536?(o[el++]=222,o[el++]=r>>8,o[el++]=255&r):(o[el++]=223,l.setUint32(el,r),el+=4),e))pack(t),pack(n)}else{for(let t=0,r=a.length;t<r;t++)if(e instanceof i[t]){let r,n=a[t];if(n.write){n.type&&(o[el++]=212,o[el++]=n.type,o[el++]=0);let t=n.write.call(this,e);t===e?Array.isArray(e)?packArray(e):T(e):pack(t);return}let i=o,s=l,u=el;o=null;try{r=n.pack.call(this,e,e=>(o=i,i=null,(el+=e)>d&&makeRoom(el),{target:o,targetView:l,position:el-e}),pack)}finally{i&&(o=i,l=s,el=u,d=o.length-10)}r&&(r.length+el>d&&makeRoom(r.length+el),el=writeExtensionData(r,o,el,n.type));return}if(Array.isArray(e))packArray(e);else{if(e.toJSON){let t=e.toJSON();if(t!==e)return pack(t)}if("function"===n)return pack(this.writeFunction&&this.writeFunction(e));T(e)}}}else o[el++]=192}else if("boolean"===n)o[el++]=e?195:194;else if("bigint"===n){if(e<0x7fffffffffffffff&&e>=-0x8000000000000000)o[el++]=211,l.setBigInt64(el,e);else if(e<18446744073709552e3&&e>0)o[el++]=207,l.setBigUint64(el,e);else if(this.largeBigIntToFloat)o[el++]=203,l.setFloat64(el,Number(e));else if(this.largeBigIntToString)return pack(e.toString());else if(this.useBigIntExtension||this.moreTypes){let t,r=e<0?BigInt(-1):BigInt(0);if(e>>BigInt(65536)===r){let n=BigInt(18446744073709552e3)-BigInt(1),a=[];for(;a.push(e&n),e>>BigInt(63)!==r;)e>>=BigInt(64);(t=new Uint8Array(new BigUint64Array(a).buffer)).reverse()}else{let r=e<0,n=(r?~e:e).toString(16);if(n.length%2?n="0"+n:parseInt(n.charAt(0),16)>=8&&(n="00"+n),ea)t=Buffer.from(n,"hex");else{t=new Uint8Array(n.length/2);for(let e=0;e<t.length;e++)t[e]=parseInt(n.slice(2*e,2*e+2),16)}if(r)for(let e=0;e<t.length;e++)t[e]=~t[e]}t.length+el>d&&makeRoom(t.length+el),el=writeExtensionData(t,o,el,66);return}else throw RangeError(e+" was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string");el+=8}else if("undefined"===n)this.encodeUndefinedAsNil?o[el++]=192:(o[el++]=212,o[el++]=0,o[el++]=0);else throw Error("Unknown type: "+n)},k=this.variableMapSize||this.coercibleKeyAsNumber||this.skipValues?e=>{let t,r;if(this.skipValues)for(let r in t=[],e)("function"!=typeof e.hasOwnProperty||e.hasOwnProperty(r))&&!this.skipValues.includes(e[r])&&t.push(r);else t=Object.keys(e);let n=t.length;if(n<16?o[el++]=128|n:n<65536?(o[el++]=222,o[el++]=n>>8,o[el++]=255&n):(o[el++]=223,l.setUint32(el,n),el+=4),this.coercibleKeyAsNumber)for(let a=0;a<n;a++){let n=Number(r=t[a]);pack(isNaN(n)?r:n),pack(e[r])}else for(let a=0;a<n;a++)pack(r=t[a]),pack(e[r])}:e=>{o[el++]=222;let r=el-t;el+=2;let n=0;for(let t in e)("function"!=typeof e.hasOwnProperty||e.hasOwnProperty(t))&&(pack(t),pack(e[t]),n++);if(n>65535)throw Error('Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object');o[r+++t]=n>>8,o[r+t]=255&n},x=!1===this.useRecords?k:e.progressiveRecords&&!g?e=>{let r,n,a=c.transitions||(c.transitions=Object.create(null)),i=el++-t;for(let o in e)if("function"!=typeof e.hasOwnProperty||e.hasOwnProperty(o)){if(n=a[o])a=n;else{let s=Object.keys(e),l=a;a=c.transitions;let d=0;for(let e=0,t=s.length;e<t;e++){let t=s[e];!(n=a[t])&&(n=a[t]=Object.create(null),d++),a=n}i+t+1==el?(el--,newRecord(a,s,d)):insertNewRecord(a,s,i,d),r=!0,a=l[o]}pack(e[o])}if(!r){let r=a[ec];r?o[i+t]=r:insertNewRecord(a,Object.keys(e),i,0)}}:e=>{let t,r=c.transitions||(c.transitions=Object.create(null)),n=0;for(let a in e)("function"!=typeof e.hasOwnProperty||e.hasOwnProperty(a))&&(!(t=r[a])&&(t=r[a]=Object.create(null),n++),r=t);let a=r[ec];for(let t in a?a>=96&&g?(o[el++]=(31&(a-=96))+96,o[el++]=a>>5):o[el++]=a:newRecord(r,r.__keys__||Object.keys(e),n),e)("function"!=typeof e.hasOwnProperty||e.hasOwnProperty(t))&&pack(e[t])},w="function"==typeof this.useRecords&&this.useRecords,T=w?e=>{w(e)?x(e):k(e)}:x,makeRoom=e=>{let r;if(e>16777216){if(e-t>es)throw Error("Packed buffer would be larger than maximum buffer size");r=Math.min(es,4096*Math.round(Math.max((e-t)*(e>67108864?1.25:2),4194304)/4096))}else r=(Math.max(e-t<<2,o.length-1)>>12)+1<<12;let n=new ei(r);return l=n.dataView||(n.dataView=new DataView(n.buffer,0,r)),e=Math.min(e,o.length),o.copy?o.copy(n,0,t,e):n.set(o.slice(t,e)),el-=t,t=0,d=n.length-10,o=n},newRecord=(e,t,n)=>{let a=c.nextId;a||(a=64),a<v&&this.shouldShareStructure&&!this.shouldShareStructure(t)?((a=c.nextOwnId)<I||(a=v),c.nextOwnId=a+1):(a>=I&&(a=v),c.nextId=a+1);let i=t.highByte=a>=96&&g?a-96>>5:-1;e[ec]=a,e.__keys__=t,c[a-64]=t,a<v?(t.isShared=!0,c.sharedLength=a-63,r=!0,i>=0?(o[el++]=(31&a)+96,o[el++]=i):o[el++]=a):(i>=0?(o[el++]=213,o[el++]=114,o[el++]=(31&a)+96,o[el++]=i):(o[el++]=212,o[el++]=114,o[el++]=a),n&&(S+=j*n),E.length>=K&&(E.shift()[ec]=0),E.push(e),pack(t))},insertNewRecord=(e,r,n,a)=>{let i=o,l=el,u=d,c=t;el=0,t=0,(o=s)||(s=o=new ei(8192)),d=o.length-10,newRecord(e,r,a),s=o;let p=el;if(o=i,el=l,d=u,t=c,p>1){let e=el+p-1;e>d&&makeRoom(e);let r=n+t;o.copyWithin(r+p,r+1,el),o.set(s.slice(0,p),r),el=e}else o[n+t]=s[0]},writeStruct=e=>{let n=u(e,o,t,el,c,makeRoom,(e,t,n)=>{if(n)return r=!0;el=t;let a=o;return(pack(e),resetStructures(),a!==o)?{position:el,targetView:l,target:o}:el},this);if(0===n)return T(e);el=n}}useBuffer(e){(o=e).dataView||(o.dataView=new DataView(o.buffer,o.byteOffset,o.byteLength)),l=o.dataView,el=0}set position(e){el=e}get position(){return el}clearSharedData(){this.structures&&(this.structures=[]),this.typedStructs&&(this.typedStructs=[])}};function writeExtBuffer(e,t,r,n){let a=e.byteLength;if(a+1<256){var{target:i,position:o}=r(4+a);i[o++]=199,i[o++]=a+1}else if(a+1<65536){var{target:i,position:o}=r(5+a);i[o++]=200,i[o++]=a+1>>8,i[o++]=a+1&255}else{var{target:i,position:o,targetView:s}=r(7+a);i[o++]=201,s.setUint32(o,a+1),o+=4}i[o++]=116,i[o++]=t,e.buffer||(e=new Uint8Array(e)),i.set(new Uint8Array(e.buffer,e.byteOffset,e.byteLength),o)}function writeBuffer(e,t){let r=e.byteLength;if(r<256){var n,a,{target:n,position:a}=t(r+2);n[a++]=196,n[a++]=r}else if(r<65536){var{target:n,position:a}=t(r+3);n[a++]=197,n[a++]=r>>8,n[a++]=255&r}else{var{target:n,position:a,targetView:i}=t(r+5);n[a++]=198,i.setUint32(a,r),a+=4}n.set(e,a)}function writeExtensionData(e,t,r,n){let a=e.length;switch(a){case 1:t[r++]=212;break;case 2:t[r++]=213;break;case 4:t[r++]=214;break;case 8:t[r++]=215;break;case 16:t[r++]=216;break;default:a<256?(t[r++]=199,t[r++]=a):(a<65536?(t[r++]=200,t[r++]=a>>8):(t[r++]=201,t[r++]=a>>24,t[r++]=a>>16&255,t[r++]=a>>8&255),t[r++]=255&a)}return t[r++]=n,t.set(e,r),r+=a}function writeBundles(e,t,r){if(ed.length>0){l.setUint32(ed.position+e,el+r-ed.position-e),ed.stringsPosition=el-e;let n=ed;ed=null,t(n[0]),t(n[1])}}function prepareStructures$1(e,t){return e.isCompatible=e=>{let r=!e||(t.lastNamedStructuresLength||0)===e.length;return r||t._mergeStructures(e),r},e}i=[Date,Set,Error,RegExp,ArrayBuffer,Object.getPrototypeOf(Uint8Array.prototype).constructor,DataView,C1Type],a=[{pack(e,t,r){let n=e.getTime()/1e3;if((this.useTimestamp32||0===e.getMilliseconds())&&n>=0&&n<4294967296){let{target:e,targetView:r,position:a}=t(6);e[a++]=214,e[a++]=255,r.setUint32(a,n)}else if(n>0&&n<4294967296){let{target:r,targetView:a,position:i}=t(10);r[i++]=215,r[i++]=255,a.setUint32(i,4e6*e.getMilliseconds()+(n/1e3/4294967296>>0)),a.setUint32(i+4,n)}else if(isNaN(n)){if(this.onInvalidDate)return t(0),r(this.onInvalidDate());let{target:e,targetView:n,position:a}=t(3);e[a++]=212,e[a++]=255,e[a++]=255}else{let{target:r,targetView:a,position:i}=t(15);r[i++]=199,r[i++]=12,r[i++]=255,a.setUint32(i,1e6*e.getMilliseconds()),a.setBigInt64(i+4,BigInt(Math.floor(n)))}}},{pack(e,t,r){if(this.setAsEmptyObject)return t(0),r({});let n=Array.from(e),{target:a,position:i}=t(this.moreTypes?3:0);this.moreTypes&&(a[i++]=212,a[i++]=115,a[i++]=0),r(n)}},{pack(e,t,r){let{target:n,position:a}=t(this.moreTypes?3:0);this.moreTypes&&(n[a++]=212,n[a++]=101,n[a++]=0),r([e.name,e.message,e.cause])}},{pack(e,t,r){let{target:n,position:a}=t(this.moreTypes?3:0);this.moreTypes&&(n[a++]=212,n[a++]=120,n[a++]=0),r([e.source,e.flags])}},{pack(e,t){this.moreTypes?writeExtBuffer(e,16,t):writeBuffer(ea?Buffer.from(e):new Uint8Array(e),t)}},{pack(e,t){let r=e.constructor;r!==eo&&this.moreTypes?writeExtBuffer(e,$.indexOf(r.name),t):writeBuffer(e,t)}},{pack(e,t){this.moreTypes?writeExtBuffer(e,17,t):writeBuffer(ea?Buffer.from(e):new Uint8Array(e),t)}},{pack(e,t){let{target:r,position:n}=t(1);r[n]=193}}];let ep=new Packr({useRecords:!1}),ey=ep.pack,em=ep.pack,{NEVER:eh,ALWAYS:ef,DECIMAL_ROUND:eb,DECIMAL_FIT:eK}=et,eg=512,ev=1024,eI=2048,eE=["num","object","string","ascii"];eE[16]="date";let eS=[!1,!0,!0,!1,!1,!0,!0,!1];try{Function(""),c=!0}catch(e){}let ej="undefined"!=typeof Buffer;try{y=new TextEncoder}catch(e){}let ek=ej?function(e,t,r){return e.utf8Write(t,r,e.byteLength-r)}:!!y&&!!y.encodeInto&&function(e,t,r){return y.encodeInto(t,e.subarray(r)).written};function anyType(e,t,r,n){let a;return(a=e.ascii8||e.num8)?(r.setInt8(t,n,!0),p=t+1,a):(a=e.string16||e.object16)?(r.setInt16(t,n,!0),p=t+2,a):(a=e.num32)?(r.setUint32(t,3758096640+n,!0),p=t+4,a):(a=e.num64)?(r.setFloat64(t,NaN,!0),r.setInt8(t,n),p=t+8,a):void(p=t)}function createTypeTransition(e,t,r){let n=eE[t]+(r<<3),a=e[n]||(e[n]=Object.create(null));return a.__type=t,a.__size=r,a.__parent=e,a}u=function writeStruct(e,t,r,n,a,i,o,s){let l,d=s.typedStructs||(s.typedStructs=[]),u=t.dataView,c=(d.lastStringStart||100)+n,y=t.length-10,m=n;n>y&&(u=(t=i(n)).dataView,n-=r,m-=r,c-=r,r=0,y=t.length-10);let h,f=c,b=d.transitions||(d.transitions=Object.create(null)),K=d.nextId||d.length,g=K<15?1:K<240?2:K<61440?3:K<15728640?4:0;if(0===g)return 0;n+=g;let v=[],I=0;for(let a in e){let s=e[a],g=b[a];switch(g||(b[a]=g={key:a,parent:b,enumerationOffset:0,ascii0:null,ascii8:null,num8:null,string16:null,object16:null,num32:null,float64:null,date64:null}),n>y&&(u=(t=i(n)).dataView,n-=r,m-=r,c-=r,f-=r,r=0,y=t.length-10),typeof s){case"number":if(K<200||!g.num64){if(s>>0===s&&s<536870912&&s>-520093696){s<246&&s>=0&&(g.num8&&!(K>200&&g.num32)||s<32&&!g.num32)?(b=g.num8||createTypeTransition(g,0,1),t[n++]=s):(b=g.num32||createTypeTransition(g,0,4),u.setUint32(n,s,!0),n+=4);break}if(s<4294967296&&s>=-2147483648&&(u.setFloat32(n,s,!0),eS[t[n+3]>>>5])){let e;if((e=s*H[(127&t[n+3])<<1|t[n+2]>>7])>>0===e){b=g.num32||createTypeTransition(g,0,4),n+=4;break}}}b=g.num64||createTypeTransition(g,0,8),u.setFloat64(n,s,!0),n+=8;break;case"string":let E,S=s.length;if(h=f-c,(S<<2)+f>y&&(u=(t=i((S<<2)+f)).dataView,n-=r,m-=r,c-=r,f-=r,r=0,y=t.length-10),S>65280+h>>2){v.push(a,s,n-m);break}let j=f;if(S<64){let e,r,n;for(e=0;e<S;e++)(r=s.charCodeAt(e))<128?t[f++]=r:(r<2048?(E=!0,t[f++]=r>>6|192):((64512&r)==55296&&(64512&(n=s.charCodeAt(e+1)))==56320?(E=!0,r=65536+((1023&r)<<10)+(1023&n),e++,t[f++]=r>>18|240,t[f++]=r>>12&63|128):(E=!0,t[f++]=r>>12|224),t[f++]=r>>6&63|128),t[f++]=63&r|128)}else f+=ek(t,s,f),E=f-j>S;if(h<160||h<246&&(g.ascii8||g.string8)){if(E)(b=g.string8)||(d.length>10&&(b=g.ascii8)?(b.__type=2,g.ascii8=null,g.string8=b,o(null,0,!0)):b=createTypeTransition(g,2,1));else if(0!==h||l)(b=g.ascii8)||d.length>10&&(b=g.string8)||(b=createTypeTransition(g,3,1));else{l=!0,b=g.ascii0||createTypeTransition(g,3,0);break}t[n++]=h}else b=g.string16||createTypeTransition(g,2,2),u.setUint16(n,h,!0),n+=2;break;case"object":s?s.constructor===Date?(b=g.date64||createTypeTransition(g,16,8),u.setFloat64(n,s.getTime(),!0),n+=8):v.push(a,s,I):(g=anyType(g,n,u,-10))?(b=g,n=p):v.push(a,s,I);break;case"boolean":b=g.num8||g.ascii8||createTypeTransition(g,0,1),t[n++]=s?249:248;break;case"undefined":(g=anyType(g,n,u,-9))?(b=g,n=p):v.push(a,s,I);break;default:v.push(a,s,I)}I++}for(let e=0,a=v.length;e<a;){let a,i=v[e++],s=v[e++],l=v[e++],d=b[i];if(d||(b[i]=d={key:i,parent:b,enumerationOffset:l-I,ascii0:null,ascii8:null,num8:null,string16:null,object16:null,num32:null,float64:null}),s){let e;(h=f-c)<65280?(b=d.object16)?e=2:(b=d.object32)?e=4:(b=createTypeTransition(d,1,2),e=2):(b=d.object32||createTypeTransition(d,1,4),e=4),"object"==typeof(a=o(s,f))?(f=a.position,u=a.targetView,t=a.target,c-=r,n-=r,m-=r,r=0):f=a,2===e?(u.setUint16(n,h,!0),n+=2):(u.setUint32(n,h,!0),n+=4)}else b=d.object16||createTypeTransition(d,1,2),u.setInt16(n,null===s?-10:-9,!0),n+=2;I++}let E=b[ec];if(null==E){let e;E=s.typedStructs.length;let t=[],r=b;for(;void 0!==(e=r.__type);){let n=[e,r.__size,(r=r.__parent).key];r.enumerationOffset&&n.push(r.enumerationOffset),t.push(n),r=r.parent}t.reverse(),b[ec]=E,s.typedStructs[E]=t,o(null,0,!0)}switch(g){case 1:if(E>=16)return 0;t[m]=E+32;break;case 2:if(E>=256)return 0;t[m]=56,t[m+1]=E;break;case 3:if(E>=65536)return 0;t[m]=57,u.setUint16(m+1,E,!0);break;case 4:if(E>=16777216)return 0;u.setUint32(m,(E<<8)+58,!0)}if(n<c){if(c===f)return n;t.copyWithin(n,c,f),f+=n-c,d.lastStringStart=n-m}else if(n>c)return c===f?n:(d.lastStringStart=n-m,writeStruct(e,t,r,m,a,i,o,s));return f},prepareStructures$1=function(e,t){if(t.typedStructs){let r=new Map;r.set("named",e),r.set("typed",t.typedStructs),e=r}let r=t.lastTypedStructuresLength||0;return e.isCompatible=e=>{let n=!0;return e instanceof Map?((e.get("named")||[]).length!==(t.lastNamedStructuresLength||0)&&(n=!1),(e.get("typed")||[]).length!==r&&(n=!1)):(e instanceof Array||Array.isArray(e))&&e.length!==(t.lastNamedStructuresLength||0)&&(n=!1),n||t._mergeStructures(e),n},t.lastTypedStructuresLength=t.typedStructs&&t.typedStructs.length,e};var ex=Symbol.for("source");function toConstant(e){switch(e){case 246:return null;case 247:return;case 248:return!1;case 249:return!0}throw Error("Unknown constant")}S=function(e,t,r,n){let a=e[t++]-32;if(a>=24)switch(a){case 24:a=e[t++];break;case 25:a=e[t++]+(e[t++]<<8);break;case 26:a=e[t++]+(e[t++]<<8)+(e[t++]<<16);break;case 27:a=e[t++]+(e[t++]<<8)+(e[t++]<<16)+(e[t++]<<24)}let i=n.typedStructs&&n.typedStructs[a];if(!i){if(e=Uint8Array.prototype.slice.call(e,t,r),r-=t,t=0,!n.getStructures)throw Error(`Reference to shared structure ${a} without getStructures method`);if(n._mergeStructures(n.getStructures()),!n.typedStructs)throw Error("Could not find any shared typed structures");if(n.lastTypedStructuresLength=n.typedStructs.length,!(i=n.typedStructs[a]))throw Error("Could not find typed structure "+a)}var o=i.construct,s=i.fullConstruct;if(!o){let e;o=i.construct=function(){},(s=i.fullConstruct=function(){}).prototype=n.structPrototype||{};var l=o.prototype=n.structPrototype?Object.create(n.structPrototype):{};let t=[],r=0;for(let a=0,o=i.length;a<o;a++){let o,s;let[l,d,u,c]=i[a];"__proto__"===u&&(u="__proto_");let p={key:u,offset:r};switch(c?t.splice(a+c,0,p):t.push(p),d){case 0:o=()=>0;break;case 1:o=(e,t)=>{let r=e.bytes[t+p.offset];return r>=246?toConstant(r):r};break;case 2:o=(e,t)=>{let r=e.bytes,n=(r.dataView||(r.dataView=new DataView(r.buffer,r.byteOffset,r.byteLength))).getUint16(t+p.offset,!0);return n>=65280?toConstant(255&n):n};break;case 4:o=(e,t)=>{let r=e.bytes,n=(r.dataView||(r.dataView=new DataView(r.buffer,r.byteOffset,r.byteLength))).getUint32(t+p.offset,!0);return n>=4294967040?toConstant(255&n):n}}switch(p.getRef=o,r+=d,l){case 3:e&&!e.next&&(e.next=p),e=p,p.multiGetCount=0,s=function(e){let t=e.bytes,n=e.position,a=r+n,i=o(e,n);if("number"!=typeof i)return i;let s,l=p.next;for(;l&&"number"!=typeof(s=l.getRef(e,n));)s=null,l=l.next;return(null==s&&(s=e.bytesEnd-a),e.srcString)?e.srcString.slice(i,s):function(e,t,r){let n=f;f=e,w=t;try{return readStringJS(r)}finally{f=n}}(t,i+a,s-i)};break;case 2:case 1:e&&!e.next&&(e.next=p),e=p,s=function(e){let t=e.position,a=r+t,i=o(e,t);if("number"!=typeof i)return i;let s=e.bytes,d,u=p.next;for(;u&&"number"!=typeof(d=u.getRef(e,t));)d=null,u=u.next;if(null==d&&(d=e.bytesEnd-a),2===l)return s.toString("utf8",i+a,d+a);m=e;try{return n.unpack(s,{start:i+a,end:d+a})}finally{m=null}};break;case 0:switch(d){case 4:s=function(e){let t=e.bytes,r=t.dataView||(t.dataView=new DataView(t.buffer,t.byteOffset,t.byteLength)),n=e.position+p.offset,a=r.getInt32(n,!0);if(a<536870912){if(a>-520093696)return a;if(a>-536870912)return toConstant(255&a)}let i=r.getFloat32(n,!0),o=H[(127&t[n+3])<<1|t[n+2]>>7];return(o*i+(i>0?.5:-.5)>>0)/o};break;case 8:s=function(e){let t=e.bytes,r=(t.dataView||(t.dataView=new DataView(t.buffer,t.byteOffset,t.byteLength))).getFloat64(e.position+p.offset,!0);if(isNaN(r)){let r=t[e.position+p.offset];if(r>=246)return toConstant(r)}return r};break;case 1:s=function(e){let t=e.bytes[e.position+p.offset];return t<246?t:toConstant(t)}}break;case 16:s=function(e){let t=e.bytes,r=t.dataView||(t.dataView=new DataView(t.buffer,t.byteOffset,t.byteLength));return new Date(r.getFloat64(e.position+p.offset,!0))}}p.get=s}if(c){let e,r=[],a=[],i=0;for(let o of t){if(n.alwaysLazyProperty&&n.alwaysLazyProperty(o.key)){e=!0;continue}Object.defineProperty(l,o.key,{get:function(e){return function(){return e(this[ex])}}(o.get),enumerable:!0});let t="v"+i++;a.push(t),r.push("o["+JSON.stringify(o.key)+"]="+t+"(s)")}e&&r.push("__proto__:this");let o=Function(...a,"var c=this;return function(s){var o=new c();"+r.join(";")+";return o;}").apply(s,t.map(e=>e.get));Object.defineProperty(l,"toJSON",{value(e){return o.call(this,this[ex])}})}else Object.defineProperty(l,"toJSON",{value(e){let r={};for(let e=0,n=t.length;e<n;e++){let n=t[e].key;r[n]=this[n]}return r}})}var d=new o;return d[ex]={bytes:e,position:t,srcString:"",bytesEnd:r},d},j=function(e){if(!(e instanceof Map))return e;let t=e.get("typed")||[];Object.isFrozen(t)&&(t=t.map(e=>e.slice(0)));let r=e.get("named"),n=Object.create(null);for(let e=0,r=t.length;e<r;e++){let r=t[e],a=n;for(let[e,t,n]of r){let r=a[n];r||(a[n]=r={key:n,parent:a,enumerationOffset:0,ascii0:null,ascii8:null,num8:null,string16:null,object16:null,num32:null,float64:null,date64:null}),a=createTypeTransition(r,e,t)}a[ec]=e}return t.transitions=n,this.typedStructs=t,this.lastTypedStructuresLength=t.length,r},k=function(){m&&(m.bytes=Uint8Array.prototype.slice.call(m.bytes,m.position,m.bytesEnd),m.position=0,m.bytesEnd=m.bytes.length)};let PackrStream=class PackrStream extends x.Transform{constructor(e){e||(e={}),e.writableObjectMode=!0,super(e),e.sequential=!0,this.packr=e.packr||new Packr(e)}_transform(e,t,r){this.push(this.packr.pack(e)),r()}};let UnpackrStream=class UnpackrStream extends x.Transform{constructor(e){e||(e={}),e.objectMode=!0,super(e),e.structures=[],this.unpackr=e.unpackr||new Unpackr(e)}_transform(e,t,r){let n;this.incompleteBuffer&&(e=Buffer.concat([this.incompleteBuffer,e]),this.incompleteBuffer=null);try{n=this.unpackr.unpackMultiple(e)}catch(t){if(t.incomplete)this.incompleteBuffer=e.slice(t.lastPosition),n=t.values;else throw t}finally{for(let e of n||[])null===e&&(e=this.getNullValue()),this.push(e)}r&&r()}getNullValue(){return Symbol.for(null)}};async function*packIterAsync(e,t){let r=new Packr(t);for await(let t of e)yield r.pack(t)}let ew=void 0!==process.env.MSGPACKR_NATIVE_ACCELERATION_DISABLED&&"true"===process.env.MSGPACKR_NATIVE_ACCELERATION_DISABLED.toLowerCase();if(!ew){let e;try{(e=r(49476))&&function(e){function readString(t){return function(r){let n=D[O++];if(null==n){if(v)return readStringJS(r);let a=f.byteOffset,i=e(w-t+a,b+a,f.buffer);if("string"==typeof i)n=i,D=T;else if(O=1,P=1,void 0===(n=(D=i)[0]))throw Error("Unexpected end of buffer")}let a=n.length;return a<=r?(w+=r,n):(g=n,R=w,P=w+a,w+=r,n.slice(0,r))}}t.isNativeAccelerationEnabled=!0,F=readString(1),V=readString(2),q=readString(3),G=readString(5)}(e.extractStrings)}catch(e){}}t.ALWAYS=ef,t.C1=_,t.DECIMAL_FIT=eK,t.DECIMAL_ROUND=eb,t.Decoder=Unpackr,t.DecoderStream=UnpackrStream,t.Encoder=Packr,t.EncoderStream=PackrStream,t.FLOAT32_OPTIONS=et,t.NEVER=eh,t.Packr=Packr,t.PackrStream=PackrStream,t.Unpackr=Unpackr,t.UnpackrStream=UnpackrStream,t.addExtension=function(e){if(e.Class){if(!e.pack&&!e.write)throw Error("Extension has no pack or write function");if(e.pack&&!e.type)throw Error("Extension has no type (numeric code to identify the extension)");i.unshift(e.Class),a.unshift(e)}e.unpack?C[e.type]=e.unpack:C[e.type]=e},t.clearSource=clearSource,t.decode=ee,t.decodeIter=function(e,t={}){let r;if(!e||"object"!=typeof e)throw Error("first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a promise");let n=new Unpackr(t),parser=e=>{let t;r&&(e=Buffer.concat([r,e]),r=void 0);try{t=n.unpackMultiple(e)}catch(n){if(n.incomplete)r=e.slice(n.lastPosition),t=n.values;else throw n}return t};return"function"==typeof e[Symbol.iterator]?function*(){for(let t of e)yield*parser(t)}():"function"==typeof e[Symbol.asyncIterator]?async function*(){for await(let t of e)yield*parser(t)}():void 0},t.encode=em,t.encodeIter=function(e,t={}){if(e&&"object"==typeof e){if("function"==typeof e[Symbol.iterator])return function*(e,t){let r=new Packr(t);for(let t of e)yield r.pack(t)}(e,t);if("function"==typeof e.then||"function"==typeof e[Symbol.asyncIterator])return packIterAsync(e,t);throw Error("first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a Promise")}throw Error("first argument must be an Iterable, Async Iterable, or a Promise for an Async Iterable")},t.mapsAsObjects=!0,t.pack=ey,t.roundFloat32=function(e){er[0]=e;let t=H[(127&en[3])<<1|en[2]>>7];return(t*e+(e>0?.5:-.5)>>0)/t},t.unpack=X,t.unpackMultiple=Q,t.useRecords=!1},9925:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.version=t.validate=t.v7=t.v6ToV1=t.v6=t.v5=t.v4=t.v3=t.v1ToV6=t.v1=t.stringify=t.parse=t.NIL=t.MAX=void 0;var n=r(52217);Object.defineProperty(t,"MAX",{enumerable:!0,get:function(){return n.default}});var a=r(51486);Object.defineProperty(t,"NIL",{enumerable:!0,get:function(){return a.default}});var i=r(17328);Object.defineProperty(t,"parse",{enumerable:!0,get:function(){return i.default}});var o=r(83187);Object.defineProperty(t,"stringify",{enumerable:!0,get:function(){return o.default}});var s=r(81348);Object.defineProperty(t,"v1",{enumerable:!0,get:function(){return s.default}});var l=r(75911);Object.defineProperty(t,"v1ToV6",{enumerable:!0,get:function(){return l.default}});var d=r(64660);Object.defineProperty(t,"v3",{enumerable:!0,get:function(){return d.default}});var u=r(55334);Object.defineProperty(t,"v4",{enumerable:!0,get:function(){return u.default}});var c=r(51982);Object.defineProperty(t,"v5",{enumerable:!0,get:function(){return c.default}});var p=r(93585);Object.defineProperty(t,"v6",{enumerable:!0,get:function(){return p.default}});var y=r(3506);Object.defineProperty(t,"v6ToV1",{enumerable:!0,get:function(){return y.default}});var m=r(68219);Object.defineProperty(t,"v7",{enumerable:!0,get:function(){return m.default}});var h=r(42975);Object.defineProperty(t,"validate",{enumerable:!0,get:function(){return h.default}});var f=r(83496);Object.defineProperty(t,"version",{enumerable:!0,get:function(){return f.default}})},52217:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default="ffffffff-ffff-ffff-ffff-ffffffffffff"},93038:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(6113);t.default=function(e){return Array.isArray(e)?e=Buffer.from(e):"string"==typeof e&&(e=Buffer.from(e,"utf8")),(0,n.createHash)("md5").update(e).digest()}},11943:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(6113);t.default={randomUUID:n.randomUUID}},51486:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default="00000000-0000-0000-0000-000000000000"},17328:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(42975);t.default=function(e){let t;if(!(0,n.default)(e))throw TypeError("Invalid UUID");return Uint8Array.of((t=parseInt(e.slice(0,8),16))>>>24,t>>>16&255,t>>>8&255,255&t,(t=parseInt(e.slice(9,13),16))>>>8,255&t,(t=parseInt(e.slice(14,18),16))>>>8,255&t,(t=parseInt(e.slice(19,23),16))>>>8,255&t,(t=parseInt(e.slice(24,36),16))/1099511627776&255,t/4294967296&255,t>>>24&255,t>>>16&255,t>>>8&255,255&t)}},37134:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.default=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i},44874:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(6113),a=new Uint8Array(256),i=a.length;t.default=function(){return i>a.length-16&&((0,n.randomFillSync)(a),i=0),a.slice(i,i+=16)}},43166:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(6113);t.default=function(e){return Array.isArray(e)?e=Buffer.from(e):"string"==typeof e&&(e=Buffer.from(e,"utf8")),(0,n.createHash)("sha1").update(e).digest()}},83187:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.unsafeStringify=void 0;let n=r(42975),a=[];for(let e=0;e<256;++e)a.push((e+256).toString(16).slice(1));function unsafeStringify(e,t=0){return(a[e[t+0]]+a[e[t+1]]+a[e[t+2]]+a[e[t+3]]+"-"+a[e[t+4]]+a[e[t+5]]+"-"+a[e[t+6]]+a[e[t+7]]+"-"+a[e[t+8]]+a[e[t+9]]+"-"+a[e[t+10]]+a[e[t+11]]+a[e[t+12]]+a[e[t+13]]+a[e[t+14]]+a[e[t+15]]).toLowerCase()}t.unsafeStringify=unsafeStringify,t.default=function(e,t=0){let r=unsafeStringify(e,t);if(!(0,n.default)(r))throw TypeError("Stringified UUID is invalid");return r}},81348:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.updateV1State=void 0;let n=r(44874),a=r(83187),i={};function updateV1State(e,t,r){return e.msecs??=-1/0,e.nsecs??=0,t===e.msecs?(e.nsecs++,e.nsecs>=1e4&&(e.node=void 0,e.nsecs=0)):t>e.msecs?e.nsecs=0:t<e.msecs&&(e.node=void 0),e.node||(e.node=r.slice(10,16),e.node[0]|=1,e.clockseq=(r[8]<<8|r[9])&16383),e.msecs=t,e}function v1Bytes(e,t,r,n,a,i,o=0){if(e.length<16)throw Error("Random bytes length must be >= 16");if(i){if(o<0||o+16>i.length)throw RangeError(`UUID byte range ${o}:${o+15} is out of buffer bounds`)}else i=new Uint8Array(16),o=0;t??=Date.now(),r??=0,n??=(e[8]<<8|e[9])&16383,a??=e.slice(10,16),t+=122192928e5;let s=((268435455&t)*1e4+r)%4294967296;i[o++]=s>>>24&255,i[o++]=s>>>16&255,i[o++]=s>>>8&255,i[o++]=255&s;let l=t/4294967296*1e4&268435455;i[o++]=l>>>8&255,i[o++]=255&l,i[o++]=l>>>24&15|16,i[o++]=l>>>16&255,i[o++]=n>>>8|128,i[o++]=255&n;for(let e=0;e<6;++e)i[o++]=a[e];return i}t.updateV1State=updateV1State,t.default=function(e,t,r){let o;let s=e?._v6??!1;if(e){let t=Object.keys(e);1===t.length&&"_v6"===t[0]&&(e=void 0)}if(e)o=v1Bytes(e.random??e.rng?.()??(0,n.default)(),e.msecs,e.nsecs,e.clockseq,e.node,t,r);else{let e=Date.now(),a=(0,n.default)();updateV1State(i,e,a),o=v1Bytes(a,i.msecs,i.nsecs,s?void 0:i.clockseq,s?void 0:i.node,t,r)}return t??(0,a.unsafeStringify)(o)}},75911:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(17328),a=r(83187);t.default=function(e){let t="string"==typeof e?(0,n.default)(e):e,r=Uint8Array.of((15&t[6])<<4|t[7]>>4&15,(15&t[7])<<4|(240&t[4])>>4,(15&t[4])<<4|(240&t[5])>>4,(15&t[5])<<4|(240&t[0])>>4,(15&t[0])<<4|(240&t[1])>>4,(15&t[1])<<4|(240&t[2])>>4,96|15&t[2],t[3],t[8],t[9],t[10],t[11],t[12],t[13],t[14],t[15]);return"string"==typeof e?(0,a.unsafeStringify)(r):r}},64660:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.URL=t.DNS=void 0;let n=r(93038),a=r(21193);var i=r(21193);function v3(e,t,r,i){return(0,a.default)(48,n.default,e,t,r,i)}Object.defineProperty(t,"DNS",{enumerable:!0,get:function(){return i.DNS}}),Object.defineProperty(t,"URL",{enumerable:!0,get:function(){return i.URL}}),v3.DNS=a.DNS,v3.URL=a.URL,t.default=v3},21193:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.URL=t.DNS=t.stringToBytes=void 0;let n=r(17328),a=r(83187);function stringToBytes(e){e=unescape(encodeURIComponent(e));let t=new Uint8Array(e.length);for(let r=0;r<e.length;++r)t[r]=e.charCodeAt(r);return t}t.stringToBytes=stringToBytes,t.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",t.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",t.default=function(e,t,r,i,o,s){let l="string"==typeof r?stringToBytes(r):r,d="string"==typeof i?(0,n.default)(i):i;if("string"==typeof i&&(i=(0,n.default)(i)),i?.length!==16)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let u=new Uint8Array(16+l.length);if(u.set(d),u.set(l,d.length),(u=t(u))[6]=15&u[6]|e,u[8]=63&u[8]|128,o){s=s||0;for(let e=0;e<16;++e)o[s+e]=u[e];return o}return(0,a.unsafeStringify)(u)}},55334:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(11943),a=r(44874),i=r(83187);t.default=function(e,t,r){if(n.default.randomUUID&&!t&&!e)return n.default.randomUUID();e=e||{};let o=e.random??e.rng?.()??(0,a.default)();if(o.length<16)throw Error("Random bytes length must be >= 16");if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,t){if((r=r||0)<0||r+16>t.length)throw RangeError(`UUID byte range ${r}:${r+15} is out of buffer bounds`);for(let e=0;e<16;++e)t[r+e]=o[e];return t}return(0,i.unsafeStringify)(o)}},51982:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.URL=t.DNS=void 0;let n=r(43166),a=r(21193);var i=r(21193);function v5(e,t,r,i){return(0,a.default)(80,n.default,e,t,r,i)}Object.defineProperty(t,"DNS",{enumerable:!0,get:function(){return i.DNS}}),Object.defineProperty(t,"URL",{enumerable:!0,get:function(){return i.URL}}),v5.DNS=a.DNS,v5.URL=a.URL,t.default=v5},93585:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(83187),a=r(81348),i=r(75911);t.default=function(e,t,r){e??={},r??=0;let o=(0,a.default)({...e,_v6:!0},new Uint8Array(16));if(o=(0,i.default)(o),t){for(let e=0;e<16;e++)t[r+e]=o[e];return t}return(0,n.unsafeStringify)(o)}},3506:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(17328),a=r(83187);t.default=function(e){let t="string"==typeof e?(0,n.default)(e):e,r=Uint8Array.of((15&t[3])<<4|t[4]>>4&15,(15&t[4])<<4|(240&t[5])>>4,(15&t[5])<<4|15&t[6],t[7],(15&t[1])<<4|(240&t[2])>>4,(15&t[2])<<4|(240&t[3])>>4,16|(240&t[0])>>4,(15&t[0])<<4|(240&t[1])>>4,t[8],t[9],t[10],t[11],t[12],t[13],t[14],t[15]);return"string"==typeof e?(0,a.unsafeStringify)(r):r}},68219:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.updateV7State=void 0;let n=r(44874),a=r(83187),i={};function updateV7State(e,t,r){return e.msecs??=-1/0,e.seq??=0,t>e.msecs?(e.seq=r[6]<<23|r[7]<<16|r[8]<<8|r[9],e.msecs=t):(e.seq=e.seq+1|0,0===e.seq&&e.msecs++),e}function v7Bytes(e,t,r,n,a=0){if(e.length<16)throw Error("Random bytes length must be >= 16");if(n){if(a<0||a+16>n.length)throw RangeError(`UUID byte range ${a}:${a+15} is out of buffer bounds`)}else n=new Uint8Array(16),a=0;return t??=Date.now(),r??=127*e[6]<<24|e[7]<<16|e[8]<<8|e[9],n[a++]=t/1099511627776&255,n[a++]=t/4294967296&255,n[a++]=t/16777216&255,n[a++]=t/65536&255,n[a++]=t/256&255,n[a++]=255&t,n[a++]=112|r>>>28&15,n[a++]=r>>>20&255,n[a++]=128|r>>>14&63,n[a++]=r>>>6&255,n[a++]=r<<2&255|3&e[10],n[a++]=e[11],n[a++]=e[12],n[a++]=e[13],n[a++]=e[14],n[a++]=e[15],n}t.updateV7State=updateV7State,t.default=function(e,t,r){let o;if(e)o=v7Bytes(e.random??e.rng?.()??(0,n.default)(),e.msecs,e.seq,t,r);else{let e=Date.now(),a=(0,n.default)();updateV7State(i,e,a),o=v7Bytes(a,i.msecs,i.seq,t,r)}return t??(0,a.unsafeStringify)(o)}},42975:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(37134);t.default=function(e){return"string"==typeof e&&n.default.test(e)}},83496:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});let n=r(42975);t.default=function(e){if(!(0,n.default)(e))throw TypeError("Invalid UUID");return parseInt(e.slice(14,15),16)}},87175:(e,t,r)=>{r.r(t),r.d(t,{__addDisposableResource:()=>__addDisposableResource,__assign:()=>__assign,__asyncDelegator:()=>__asyncDelegator,__asyncGenerator:()=>__asyncGenerator,__asyncValues:()=>__asyncValues,__await:()=>__await,__awaiter:()=>__awaiter,__classPrivateFieldGet:()=>__classPrivateFieldGet,__classPrivateFieldIn:()=>__classPrivateFieldIn,__classPrivateFieldSet:()=>__classPrivateFieldSet,__createBinding:()=>n,__decorate:()=>__decorate,__disposeResources:()=>__disposeResources,__esDecorate:()=>__esDecorate,__exportStar:()=>__exportStar,__extends:()=>__extends,__generator:()=>__generator,__importDefault:()=>__importDefault,__importStar:()=>__importStar,__makeTemplateObject:()=>__makeTemplateObject,__metadata:()=>__metadata,__param:()=>__param,__propKey:()=>__propKey,__read:()=>__read,__rest:()=>__rest,__rewriteRelativeImportExtension:()=>__rewriteRelativeImportExtension,__runInitializers:()=>__runInitializers,__setFunctionName:()=>__setFunctionName,__spread:()=>__spread,__spreadArray:()=>__spreadArray,__spreadArrays:()=>__spreadArrays,__values:()=>__values,default:()=>o});var extendStatics=function(e,t){return(extendStatics=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)};function __extends(e,t){if("function"!=typeof t&&null!==t)throw TypeError("Class extends value "+String(t)+" is not a constructor or null");function __(){this.constructor=e}extendStatics(e,t),e.prototype=null===t?Object.create(t):(__.prototype=t.prototype,new __)}var __assign=function(){return(__assign=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var a in t=arguments[r])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e}).apply(this,arguments)};function __rest(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var a=0,n=Object.getOwnPropertySymbols(e);a<n.length;a++)0>t.indexOf(n[a])&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(r[n[a]]=e[n[a]]);return r}function __decorate(e,t,r,n){var a,i=arguments.length,o=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(o=(i<3?a(o):i>3?a(t,r,o):a(t,r))||o);return i>3&&o&&Object.defineProperty(t,r,o),o}function __param(e,t){return function(r,n){t(r,n,e)}}function __esDecorate(e,t,r,n,a,i){function accept(e){if(void 0!==e&&"function"!=typeof e)throw TypeError("Function expected");return e}for(var o,s=n.kind,l="getter"===s?"get":"setter"===s?"set":"value",d=!t&&e?n.static?e:e.prototype:null,u=t||(d?Object.getOwnPropertyDescriptor(d,n.name):{}),c=!1,p=r.length-1;p>=0;p--){var y={};for(var m in n)y[m]="access"===m?{}:n[m];for(var m in n.access)y.access[m]=n.access[m];y.addInitializer=function(e){if(c)throw TypeError("Cannot add initializers after decoration has completed");i.push(accept(e||null))};var h=(0,r[p])("accessor"===s?{get:u.get,set:u.set}:u[l],y);if("accessor"===s){if(void 0===h)continue;if(null===h||"object"!=typeof h)throw TypeError("Object expected");(o=accept(h.get))&&(u.get=o),(o=accept(h.set))&&(u.set=o),(o=accept(h.init))&&a.unshift(o)}else(o=accept(h))&&("field"===s?a.unshift(o):u[l]=o)}d&&Object.defineProperty(d,n.name,u),c=!0}function __runInitializers(e,t,r){for(var n=arguments.length>2,a=0;a<t.length;a++)r=n?t[a].call(e,r):t[a].call(e);return n?r:void 0}function __propKey(e){return"symbol"==typeof e?e:"".concat(e)}function __setFunctionName(e,t,r){return"symbol"==typeof t&&(t=t.description?"[".concat(t.description,"]"):""),Object.defineProperty(e,"name",{configurable:!0,value:r?"".concat(r," ",t):t})}function __metadata(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}function __awaiter(e,t,r,n){return new(r||(r=Promise))(function(a,i){function fulfilled(e){try{step(n.next(e))}catch(e){i(e)}}function rejected(e){try{step(n.throw(e))}catch(e){i(e)}}function step(e){var t;e.done?a(e.value):((t=e.value)instanceof r?t:new r(function(e){e(t)})).then(fulfilled,rejected)}step((n=n.apply(e,t||[])).next())})}function __generator(e,t){var r,n,a,i={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]},o=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return o.next=verb(0),o.throw=verb(1),o.return=verb(2),"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function verb(s){return function(l){return function(s){if(r)throw TypeError("Generator is already executing.");for(;o&&(o=0,s[0]&&(i=0)),i;)try{if(r=1,n&&(a=2&s[0]?n.return:s[0]?n.throw||((a=n.return)&&a.call(n),0):n.next)&&!(a=a.call(n,s[1])).done)return a;switch(n=0,a&&(s=[2&s[0],a.value]),s[0]){case 0:case 1:a=s;break;case 4:return i.label++,{value:s[1],done:!1};case 5:i.label++,n=s[1],s=[0];continue;case 7:s=i.ops.pop(),i.trys.pop();continue;default:if(!(a=(a=i.trys).length>0&&a[a.length-1])&&(6===s[0]||2===s[0])){i=0;continue}if(3===s[0]&&(!a||s[1]>a[0]&&s[1]<a[3])){i.label=s[1];break}if(6===s[0]&&i.label<a[1]){i.label=a[1],a=s;break}if(a&&i.label<a[2]){i.label=a[2],i.ops.push(s);break}a[2]&&i.ops.pop(),i.trys.pop();continue}s=t.call(e,i)}catch(e){s=[6,e],n=0}finally{r=a=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,l])}}}var n=Object.create?function(e,t,r,n){void 0===n&&(n=r);var a=Object.getOwnPropertyDescriptor(t,r);(!a||("get"in a?!t.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,a)}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]};function __exportStar(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||n(t,e,r)}function __values(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function __read(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,a,i=r.call(e),o=[];try{for(;(void 0===t||t-- >0)&&!(n=i.next()).done;)o.push(n.value)}catch(e){a={error:e}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(a)throw a.error}}return o}function __spread(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(__read(arguments[t]));return e}function __spreadArrays(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;for(var n=Array(e),a=0,t=0;t<r;t++)for(var i=arguments[t],o=0,s=i.length;o<s;o++,a++)n[a]=i[o];return n}function __spreadArray(e,t,r){if(r||2==arguments.length)for(var n,a=0,i=t.length;a<i;a++)!n&&a in t||(n||(n=Array.prototype.slice.call(t,0,a)),n[a]=t[a]);return e.concat(n||Array.prototype.slice.call(t))}function __await(e){return this instanceof __await?(this.v=e,this):new __await(e)}function __asyncGenerator(e,t,r){if(!Symbol.asyncIterator)throw TypeError("Symbol.asyncIterator is not defined.");var n,a=r.apply(e,t||[]),i=[];return n=Object.create(("function"==typeof AsyncIterator?AsyncIterator:Object).prototype),verb("next"),verb("throw"),verb("return",function(e){return function(t){return Promise.resolve(t).then(e,reject)}}),n[Symbol.asyncIterator]=function(){return this},n;function verb(e,t){a[e]&&(n[e]=function(t){return new Promise(function(r,n){i.push([e,t,r,n])>1||resume(e,t)})},t&&(n[e]=t(n[e])))}function resume(e,t){try{var r;(r=a[e](t)).value instanceof __await?Promise.resolve(r.value.v).then(fulfill,reject):settle(i[0][2],r)}catch(e){settle(i[0][3],e)}}function fulfill(e){resume("next",e)}function reject(e){resume("throw",e)}function settle(e,t){e(t),i.shift(),i.length&&resume(i[0][0],i[0][1])}}function __asyncDelegator(e){var t,r;return t={},verb("next"),verb("throw",function(e){throw e}),verb("return"),t[Symbol.iterator]=function(){return this},t;function verb(n,a){t[n]=e[n]?function(t){return(r=!r)?{value:__await(e[n](t)),done:!1}:a?a(t):t}:a}}function __asyncValues(e){if(!Symbol.asyncIterator)throw TypeError("Symbol.asyncIterator is not defined.");var t,r=e[Symbol.asyncIterator];return r?r.call(e):(e=__values(e),t={},verb("next"),verb("throw"),verb("return"),t[Symbol.asyncIterator]=function(){return this},t);function verb(r){t[r]=e[r]&&function(t){return new Promise(function(n,a){(function(e,t,r,n){Promise.resolve(n).then(function(t){e({value:t,done:r})},t)})(n,a,(t=e[r](t)).done,t.value)})}}}function __makeTemplateObject(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}var a=Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t},ownKeys=function(e){return(ownKeys=Object.getOwnPropertyNames||function(e){var t=[];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[t.length]=r);return t})(e)};function __importStar(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r=ownKeys(e),i=0;i<r.length;i++)"default"!==r[i]&&n(t,e,r[i]);return a(t,e),t}function __importDefault(e){return e&&e.__esModule?e:{default:e}}function __classPrivateFieldGet(e,t,r,n){if("a"===r&&!n)throw TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!n:!t.has(e))throw TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?n:"a"===r?n.call(e):n?n.value:t.get(e)}function __classPrivateFieldSet(e,t,r,n,a){if("m"===n)throw TypeError("Private method is not writable");if("a"===n&&!a)throw TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!a:!t.has(e))throw TypeError("Cannot write private member to an object whose class did not declare it");return"a"===n?a.call(e,r):a?a.value=r:t.set(e,r),r}function __classPrivateFieldIn(e,t){if(null===t||"object"!=typeof t&&"function"!=typeof t)throw TypeError("Cannot use 'in' operator on non-object");return"function"==typeof e?t===e:e.has(t)}function __addDisposableResource(e,t,r){if(null!=t){var n,a;if("object"!=typeof t&&"function"!=typeof t)throw TypeError("Object expected.");if(r){if(!Symbol.asyncDispose)throw TypeError("Symbol.asyncDispose is not defined.");n=t[Symbol.asyncDispose]}if(void 0===n){if(!Symbol.dispose)throw TypeError("Symbol.dispose is not defined.");n=t[Symbol.dispose],r&&(a=n)}if("function"!=typeof n)throw TypeError("Object not disposable.");a&&(n=function(){try{a.call(this)}catch(e){return Promise.reject(e)}}),e.stack.push({value:t,dispose:n,async:r})}else r&&e.stack.push({async:!0});return t}var i="function"==typeof SuppressedError?SuppressedError:function(e,t,r){var n=Error(r);return n.name="SuppressedError",n.error=e,n.suppressed=t,n};function __disposeResources(e){function fail(t){e.error=e.hasError?new i(t,e.error,"An error was suppressed during disposal."):t,e.hasError=!0}var t,r=0;return function next(){for(;t=e.stack.pop();)try{if(!t.async&&1===r)return r=0,e.stack.push(t),Promise.resolve().then(next);if(t.dispose){var n=t.dispose.call(t.value);if(t.async)return r|=2,Promise.resolve(n).then(next,function(e){return fail(e),next()})}else r|=1}catch(e){fail(e)}if(1===r)return e.hasError?Promise.reject(e.error):Promise.resolve();if(e.hasError)throw e.error}()}function __rewriteRelativeImportExtension(e,t){return"string"==typeof e&&/^\.\.?\//.test(e)?e.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,function(e,r,n,a,i){return r?t?".jsx":".js":!n||a&&i?n+a+"."+i.toLowerCase()+"js":e}):e}let o={__extends,__assign,__rest,__decorate,__param,__esDecorate,__runInitializers,__propKey,__setFunctionName,__metadata,__awaiter,__generator,__createBinding:n,__exportStar,__values,__read,__spread,__spreadArrays,__spreadArray,__await,__asyncGenerator,__asyncDelegator,__asyncValues,__makeTemplateObject,__importStar,__importDefault,__classPrivateFieldGet,__classPrivateFieldSet,__classPrivateFieldIn,__addDisposableResource,__disposeResources,__rewriteRelativeImportExtension}}};