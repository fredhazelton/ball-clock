var fs=require('fs'),src=fs.readFileSync(__dirname+'/index.html','utf8').match(/<script>([\s\S]*)<\/script>/)[1];
var m={exports:{}};new Function('module',src)(m);var E=m.exports,fail=0;
for(var start=0;start<1440;start+=37){var h=Math.floor(start/60),mi=start%60;E.setup(h,mi);var t=0;
 for(var k=1;k<=720;k++){t+=60000;E.setNow(t);E.tick();for(var f=0;f<300;f++){t+=20;E.setNow(t);E.update(20);}
  var tot=start+k,eh=Math.floor(tot/60)%12||12,em=tot%60,r=E.readTime(),C=E.C();
  var n=C.min.length+C.five.length+C.hour.length+E.res().length;
  if(r.h!==eh||r.m!==em||n!==E.balls().length||E.res().length<1){fail++;if(fail<5)console.log('FAIL',start,k,r,eh,em,n);}}}
console.log(fail?'FAILED '+fail:'PASS: 39 start times x 720 ticks, counts match, all balls conserved');process.exit(fail?1:0);
