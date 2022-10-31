/* 
Event loop

이벤트 루프는 Node.js의 Main thread로,
내부의 각 Phase를 돌면서 앱을 실행

각 Phase는 Queue로 이루어져 있으며,
Queue의 모든 Job을 수행하거나,
제한 갯수까지 실행한 후에 다음 Phase로 이동

- 순환 실행
timers
pending callbacks
idle, prepare
poll
check
close callbacks
timers

Phase: timer
대상: setTimeout(func, delay), setInterval(func, delay)
처리 작업: delay가 지났으면, 등록된 callback 실행

Phase: poll
대상: I/O
처리 작업: 대부분의 callback 실행

Phase: check
대상: setImmediate(func)
처리 작업: 등록된 callback 실행
*/

/* 
setTimeout vs setImmediate
*/

// 1. Main 모듈에서 호출되면, 호출되는 시점이 다름

// setTimeout(() => console.log('timeout'), 0);
// setImmediate(() => console.log('immediate'));

/*
Timeout(func, 0)의 0ms는 1ms로 동작

1) timeout의 cb가 timers queue에 등록
2) immediate의 cb가 check queue에 등록
3) Loop 시작, timers phase
3.A) 1ms 전 이라면 check queue에 등록된 immediate의 cb가 먼저 실행
3.B) 1ms 후 라면 timers queue에 등록된 timeout의 cb가 먼저 실행
*/

// 2. I/O cycle 에서는, immediate 콜백이 항상 먼저 실행

// require('fs').readFile('timer.js', _ => {
//     setTimeout(() => console.log('timeout'), 0);
//     setImmediate(() => console.log('immediate'));
// });

/*
1) fs.readFile()이 실행되고, cb가 poll queue에 등록
2) poll phase에 진입
3) timeout의 cb가 timers queue에 등록
4) immediate의 cb가 check queue에 등록
5) poll queue의 Job을 모두 소진했으니, 다음 phase인 check phase로 이동
*/

/* 
process.nextTick

Event loop의 일부가 아니며
process.nextTick(cb)의 callback은 nextTick queue에 등록되며, 각 phase 사이 사이에서 호출됨

process.nextTick() is not technically part of the event loop.
Instead, the nextTickQueue will be processed after the current operation is completed,
regardless of the current phase of the event loop.
*/

// setTimeout(() => console.log('timeout1'), 0);
// setImmediate(() => console.log('immediate1'));

// process.nextTick(() => {
//     setTimeout(() => console.log('timeout2'), 0);
//     setImmediate(() => {
//         process.nextTick(() => console.log('tick2'));
//         console.log('immediate2');
//     });

//     console.log('tick1');
// });

/* 
출력 순서
tick1
timeout1
timeout2
immediate1
immediate2
tick2

1) timeout의 cb가 timers queue에 등록
2) immediate의 cb가 check queue에 등록
3) nextTick의 cb가 nextTick queue에 등록되고, 가장 먼저 실행
4) nextTick의 callback의 Timeout과 Immediate의 각각의 cb가 queue에 등록
*/

/*
Promise queue와 nextTick queue 중 어느 queue의 작업이 먼저 실행되는가?
nextTick queue의 작업이 항상 먼저 실행됨

이벤트 비동기 실행 순서: nextTick -> promise -> timeout
*/

// const promise = new Promise(resolve => {
//     console.log("promise");
//     resolve();

//     setTimeout(() => console.log("timeout in promise"));
//     process.nextTick(() => console.log("nextTick in promise"));
// }).then(() => console.log("then"));

// process.nextTick(() => console.log("nextTick in global"));
// console.log("global");


/*
호출 스케줄링(scheduling a call)
: 일정 시간이 지난 후에 원하는 함수를 예약 실행할 수 있게 하는 것

중첩 setTimeout vs setInterval

중첩 setTimeout은 지연 간격을 보장하지만
setInterval은 지연 간격을 보장하지 않음
*/

// function func(i) {
//     console.log(i);
// }

// let i = 0;
// setInterval(() => func(++i), 100);

/*
func 호출 사이의 ‘소모되는’ 시간도 지연 간격에 포함되기 때문에,
func 호출 사이의 지연 간격이 실제 명시한 간격(100ms)보다 짧음
*/

// function func(i) {
//     console.log(i);
// }

// setTimeout(function run() {
//   func(++i);
//   setTimeout(run, 100);
// }, 100);

/*
명시한 지연 시간(100ms)이 보장
*/


// 출력 값은?

// let i = 0;
// setTimeout(() => console.log(i), 100);
// for (; i < 100000; i++);


// 출력 값은?

// let v = 0;

// const k1 = setInterval(() => v -= 1, 0);
// const k2 = setInterval(() => v += 1, 300);

// process.nextTick(() => {
//     console.log('nextTick');
// })

// const promise = new Promise(resolve => {
//     resolve();
//     process.nextTick(() => v *= 3);
//     v += 2;
// })
// .then(() => {
//     clearInterval(k1);
//     v += 4;
//     return new Promise(resolve => setTimeout(() => resolve(), 700));
// })
// .then(() => {
//     clearInterval(k2)
//     v += 6;
// })
// .finally(() => v *= 2);

// setTimeout(() => console.log(v), 3000);




// let v = 23;

// const k1 = setInterval(() => {
//     console.log('k1' + v);
//     v += 1
// }, 0);
// const k2 = setInterval(() => { 
//     console.log('k2' + v);
//     v -= 1
// }, 200);

// const promise = new Promise(resolve => {
//     resolve();
//     console.log('before promise' + v);
//     process.nextTick(() => v /= 2);
//     console.log('before promise nextTick' + v);
//     v += 1;
//     console.log('after promise' + v);
// })
// .then(() => {
//     console.log('before then' + v);
//     clearInterval(k1);
//     console.log('before then1' + v);
//     v += 1;
//     console.log('after then' + v);
//     return new Promise(resolve => setTimeout(() => resolve(), 600));
// })
// .then(() => {
//     console.log('before then2' + v);
//     clearInterval(k2)
//     console.log('before then3' + v);
//     v += 1;
//     console.log('before then4' + v);
// })
// .finally(() => v /= 2);

// console.log('finally' + v);

// setTimeout(() => console.log(v), 2000);


// let v = 23;

// const k1 = setInterval(() => {
//     console.log('k1' + v);
//     v += 1
// }, 0);
// const k2 = setInterval(() => { 
//     console.log('k2' + v);
//     v -= 1
// }, 200);

// process.nextTick(() => {
//     console.log('nextTick');
// })

// const promise = new Promise(resolve => {
//     resolve();
//     console.log('before promise' + v);
//     process.nextTick(() => v /= 2);
//     console.log('before promise nextTick' + v);
//     v += 1;
//     console.log('after promise' + v);
// })
// .then(() => {
//     console.log('before then' + v);
//     clearInterval(k1);
//     console.log('before then1' + v);
//     v += 1;
//     console.log('after then' + v);
//     return new Promise(resolve => setTimeout(() => resolve(), 600));
// })
// .then(() => {
//     console.log('before then2' + v);
//     clearInterval(k2)
//     console.log('before then3' + v);
//     v += 1;
//     console.log('before then4' + v);
// })
// .finally(() => v /= 2);

// console.log('finally' + v);

// setTimeout(() => console.log(v), 2000);

// 먼저 setTimeOut과 setInterval은 각각 timer Queue, check Queue에 들어가게되고 Promise Queue를 먼저 보게된다, Promise는 제어권을 뺏기지않아서 계속 실행이 되다가 
// return으로 새로운 promise객체를 생성하는데 이때 setTimeout으로 600밀리초라는 시간이 주어지고 k1은 clear됬지만 k2는 남아있기에 600 / 200 총 3번 인터벌되고 이후에 다음 then과 finally를 진행하게된다 

// 만약에 return으로 새로운 프로미스객체를 반환하여 시간을 주지않았다면 k2는 실행되지않고 두번째 then이 먼저 출력이 된다


let v = 23;

const k1 = setInterval(() => v += 1, 0);
const k2 = setInterval(() => v -= 1, 200);

const promise = new Promise(resolve => {
    resolve();
    process.nextTick(() => v /= 2);
    v += 1;
})
.then(() => {
    clearInterval(k1);
    v += 1;
    return new Promise(resolve => setTimeout(() => resolve(), 500));
})
.then(() => {
    clearInterval(k2)
    v += 1;
})
.finally(() => v /= 2);

setTimeout(() => console.log(v), 2000);