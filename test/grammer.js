// // ES5 버전과 ES6 이후 버전을 비교하면서 자바스크립트 문법을 살펴보겠습니다.

// // Function scope vs. Block scope

// var a = 10;
// let b = 20;

// {
//     var a = 40;
//     let b = 80;
// }

// console.log(a + b);

// {
//     const y = 3;
// }
// console.log(y);

// const a = 0;
// a = 1;

// // const c;



// // String Interpolation

// var num1 = 1;
// var num2 = 2;
// var result = 3;
// var str = num1 + ' + ' + num2 + ' = ' + result;
// console.log(str);

// var str = `${num2} + ${num1} = ${result}`;
// console.log(str);



// // 함수 표현식
// var func = function() {
//     console.log("함수 표현식")
// }

// // 함수 선언문
// function func() {
//     console.log("함수 선언문");
// }

// // 호이스팅에 의해서 함수 표현식이 출력됨
// console.log(func())



// // 호이스팅에 의해서 함수 선언문이 출력됨
// console.log(func())

// // 함수 표현식
// var func = function() {
//     console.log("함수 표현식")
// }

// // 함수 선언문
// function func() {
//     console.log("함수 선언문");
// }



// var obj = {
//     key1: 5,
//     key2: function() {
//         return 3;
//     } 
// }

// console.log(obj.key1 + obj.key2())


// function func1() {
//     console.log('func1');
// }

// function func2() {
//     console.log('func2');
// }

// var obj = {
//     func1: func1,
//     func2
// };

// obj.func1();
// obj.func2();


// var obj = {
//     func1: function() {
//         console.log("func1");
//     },
//     func2() {
//         console.log("func2");
//     }
// }

// obj.func1();
// obj.func2();



// var key = 'ABC';

// var obj = {
// }

// obj[key + 'D'] = '100';

// console.log(obj.ABCD);
// console.log(obj);


// var key = 'KBU';

// var obj = {
//     [key + 2022]: '200'
// };

// console.log(obj.KBU2022);
// console.log(obj);



// // Arrow function

// function add1(x, y) {
//     return x + y;
// }

// const add2 = (x, y) => {
//     return x + y;
// };

// const add3 = (x, y) => x + y;


// function not1(x) {
//     return !x;
// }

// const not2 = x => !x;



// var obj = {
//     name: 'KBU',
//     list: ['a', 'b', 'c'],

//     func() {
//         this.list.forEach(function (e) { // this. 하지 않으면 list를 모름
//             console.log(this.name, e); // undefined a
//         });

//         var that = this; // obj를 가리키는 this를 that에 저장
//         this.list.forEach(function (e) {
//             console.log(that.name, e);
//         });

//         this.list.forEach(e => {
//             console.log(this.name, e);
//         });
//     }
// };

// obj.func();



// var obj = {
//     state: {
//         name: 'KBU'
//     },
//     method() {
//         return 10000;
//     },
// };

// // 1
// var name = obj.state.name;
// var method = obj.method;
// console.log(name, method());

// // 2
// var { state: { name }, method } = obj;
// console.log(name, method());



// var array = ['web', {}, 10, true]

// // 1
// var str = array[0];
// var obj = array[1];
// var bool = array[3];
// console.log(str, obj, bool);

// // 2
// const [str, obj, , bool] = array;
// console.log(str, obj, bool);


// // 클래스

// var Human = function (name, age) {
//     this.name = name;
//     this.age = age;
// };

// // 정적 메소드
// Human.isHuman = function (human) {
//     return human instanceof Human;
// }

// // 인스턴스 메소드
// Human.prototype.eat = function () {
//     console.log('eat');
// };

// var Student = function (name, age, univ) {
//     Human.call(this, name, age);
//     this.univ = univ;
// };

// Student.prototype = Object.create(Human.prototype);
// Student.prototype.constructor = Student;

// var wkim = new Student('wkim', 30, 'KBU');
// console.log(Human.isHuman(wkim));
// wkim.eat();
// console.log(wkim.name, wkim.age, wkim.univ);
// console.log(wkim);



// // 클래스

// class Human {
//     constructor(name, age) {
//         this.name = name;
//         this.age = age;
//     }

//     static isHuman(human) {
//         return human instanceof Human;
//     }

//     eat() {
//         console.log('eat');
//     }
// }

// class Student extends Human {
//     constructor(name, age, univ) {
//         super(name, age);
//         this.univ = univ;
//     }
// }

// var wkim = new Student('wkim', 30, 'KBU');
// console.log(Human.isHuman(wkim));
// wkim.eat();
// console.log(wkim.name, wkim.age, wkim.univ);
// console.log(wkim);



// // // 프로미스

// const condition = true; // true면 resolve, false면 reject

// const promise = new Promise((resolve, reject) => {
//     condition ? resolve('success') : reject('fail');
// });

// promise
// .then(msg => console.log(msg))
// .catch(err => console.error(err))
// .finally(() => console.log('무조건'));



// // // Timer

// new Promise((resolve, reject) => {
//     console.log("비동기 처리");
//     setTimeout(() => resolve("Success"), 3000)
// })
// .then(msg => console.log(msg));

// console.log("Timer in action");



// // // Chain

// new Promise((resolve, reject) => {
//     resolve('a');
// }).then(msg => {
//     return new Promise((resolve, reject) => {
//         resolve(msg + 'b');
//         // reject('fail');
//     });
// }).then((msg) => {
//     return new Promise((resolve, reject) => {
//         resolve(msg + 'c');
//     });
// }).then((msg) => {
//     return new Promise((resolve, reject) => {
//         console.log(msg);
//     });
// }).catch(err => console.error(err));

// for (let i = 0; i < 1000; i++)
//     console.log(`loop: ${i}`);



// var promise1 = Promise.resolve('success1');
// var promise2 = Promise.resolve('success2');

// Promise.all([promise1, promise2])
// .then(msg => console.log(msg))
// .catch(err => console.error(err));



var promise1 = Promise.resolve('success1');
var promise2 = Promise.resolve('success2');

const f = async () => {
    for await (msg of [promise1, promise2]) {
        console.log(msg);
    }
};

f();



// // Collection

// let fruits = ['귤', '레몬', '사과', '수박', '바나나', '복숭아', '자두', '파인애플'];

// // 배열 끝에 항목 추가
// fruits.push('포도');
// console.log(fruits);

// // 배열 끝에서부터 항목 제거
// let item = fruits.pop();
// console.log(item);
// console.log(fruits);

// // 배열 앞에서부터 항목 제거
// item = fruits.shift();
// console.log(item);
// console.log(fruits);

// // 배열 앞에 항목 추가
// fruits.unshift(item);
// console.log(fruits);



// let fruits = ['귤', '레몬', '사과', '수박', '바나나', '복숭아', '자두', '파인애플'];
// console.log(fruits);

// console.log(fruits.slice(2, 4));

// let index = fruits.indexOf('수박')
// console.log(index);

// // 인덱스 기반 항목 제거, (index, deleteCount)
// let items = fruits.splice(index, 3);
// console.log(items);
// console.log(fruits);



// let items = new Set();

// for (let i = 0; i < 5; i++) {
//     let v = Math.floor(Math.random() * 10);
//     if (items.has(v)) i--;
//     else items.add(v);
// }

// // Spread Operator
// items = [...items].sort();
// console.log(items);

// console.log(items.every(item => item < 5));
// console.log(items.some(item => item < 5));

// console.log(items.filter(item => item < 5));

// console.log(items.map(item => item + 10));

// console.log(items.reduce((acc, item) => acc + item, 100));



// Value type vs. Reference type
// let a = 10;
// let b = a;
// let obj1 = { c: 20 };
// let obj2 = obj1;

// b = 40;
// obj2.c = 80;

// console.log(a + b + obj1.c + obj2.c);
