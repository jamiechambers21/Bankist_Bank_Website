'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// const loginDetails = document.querySelector('.login_details');
// loginDetails.style.opacity = 100;

////////////////////////////////////////////// 147. Creating DOM Elements
const displayMovements = function (movements, sort = false) {
  // Empty what was already in the HTML
  containerMovements.innerHTML = '';
  // .textContent = 0

  // .slice() is used ot create a copy so .sort() doesn't mutate the orgional array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Taken from index.html and eddited
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//console.log(containerMovements.innerHTML);

///////////////////////////////////////// 153. The reduce Method
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//////////////////////////////155. The Magic of Chaining Methods
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outgoings = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outgoings)}€`;

  // interest pays out interest each time there is a deposit to the bank account
  // interest rate is 1.2% of amount
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      // Bank will only pay interest if its more than 1EUR
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  const [interestEur, interestCent] = String(interest).split('.');
  labelSumInterest.textContent = `${interestEur}.${interestCent.padEnd(2, 0)}€`;
};

////////////////////////////////////////151. Computing Usernames
const createUsernames = function (accs) {
  //Use forEach as we DONT want to create a new array
  // Only modify array
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

console.log(createUsernames(accounts));
console.log(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // When time is 0 secs, stop timer and loggout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
      //loginDetails.style.opacity = 100;
    }
    // Decrese 1 sec
    time = time - 1;
  };
  //Set time to 5 mins
  let time = 120;
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

/////////////////////////////////////////////////// 158. Implementing Login
// Event handler
let currentAccount, timer;

// FAKE ALWASY LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault(); // This prevents the page from reloading

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // currentAccount? checks to make sure there is a current account before trying to ascess it
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome message
    labelWelcome.textContent = `Welsome back , ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekend : ' long'
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const day = `${now.getDate()}`.padStart(2,0)
    // const month = `${now.getMonth()+1}`.padStart(2,0)
    // const year = now.getFullYear()
    // const hour = `${now.getHours()}`.padStart(2,0)
    // const min = `${now.getMinutes()}`.padStart(2,0)
    // labelDate.textContent = `${day}/${month}/${year},${hour}:${min}`

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // This makes a field lose it focus => removes mouse cursor

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);

    // Remove loggin details
    //loginDetails.style.opacity = 0;
  }
});

////////////////////////////////////////////////////////////////Implementing Transfers
btnTransfer.addEventListener('click', function (e) {
  // REMINDER: this will prevent the page from reloading
  // Very common when working with forms
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  // fimd the account that is equal to the username inputed
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  inputTransferAmount.value = inputTransferTo.value = '';

  //Check if sender has sufficient money and is sending to a valid account
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing Transfer
    // Minus value from senders account
    currentAccount.movements.push(-amount);
    // Add value to recievers account
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

///////////////////////////////////////// 161. some and every (Implemting loan function)
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  //Loan is only granted if any deposit is >10% requested amount of loan
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';

  // Reset timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

////////////////////////////////////////////////////////// 160. The findIndex Method
// findIndex will return the index of what you are looking for, NOT the value
// We will use this method to close an account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  //Check if both the user and pin are correct
  // console.log('Delete');
  // console.log(inputCloseUsername.value, currentAccount.username);
  // console.log(inputClosePin.value, currentAccount.pin);

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    console.log('Deleting Acc......');
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)
    // Delete account
    accounts.splice(index, 1);

    //HIDE UL
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';

  labelWelcome.textContent = 'Log in to get started';
  //loginDetails.style.opacity = 100;
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// ///////////////////////////////////////////////////////////////142. Simple Array Methods

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE (DOESNT MUTATE)
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -1));
// console.log(arr.slice());
// console.log([...arr]);

// // SPLICE (MUTATES)
// // Splice removes items from orgional array
// //console.log(arr.splice(2));
// arr.splice(-1); // remove last item from array
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// // REVERSE (MUTATES)
// // Will perminatly revers the array
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2);
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT (DOESN'T MUTATE)
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]); // SAME AS

// // JOIN (DOESN'T MUTATE)
// console.log(letters.join(' - '));

// //////////////////////////////////// 143. The new at Method
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// // getting last element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('Jamie'.at(0));
// console.log('Jamie'.at(-1));

// ////////////////////////////////144. Looping Arrays: forEach

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// //for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You depoisted ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('--------------------------------------------');

// movements.forEach(function (movement, index, array) {
//   if (movement > 0) {
//     console.log(`Movement ${index + 1}: You depoisted ${movement}`);
//   } else {
//     console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// });
// // CANNOT break out of forEach loop
// // CONTINUE and BREAK DOES NOT WORK

// //////////////////////////// 145. forEach With Maps and Sets
// // Map
// const currencies = new Map([
//   //[key, value]
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

//////////////////////////////////////////////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const checkDogs = function (dogsJulia, dogsKate) {
//   // 1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
//   const dogsJuliaCorrected = dogsJulia.slice(1, -2);
//   console.log(dogsJuliaCorrected);

//   // 2. Create an array with both Julia's (corrected) and Kate's data
//   const dogsTotal = dogsJuliaCorrected.concat(dogsKate);
//   console.log(dogsTotal);

//   // 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
//   dogsTotal.forEach(function (age, i) {
//     const type =
//       age < 3 ? 'still a puppy 🐶' : `an adult, and is ${age} years old`;

//     console.log(`Dog number ${i + 1} is ${type}`);
//   });
// };

// // 4. Run the function for both test datasets
// let dogsJulia = [3, 5, 2, 12, 7];
// let dogsKate = [4, 1, 15, 8, 3];
// checkDogs(dogsJulia, dogsKate);

// dogsJulia = [9, 16, 6, 8, 3];
// dogsKate = [10, 5, 6, 1, 4];
// checkDogs(dogsJulia, dogsKate);

//////////////////////////////////////////// 149. Data Transformations: map, filter, reduce

// MAP
// map returns new array containing the results of applying an operation on all origional array elements
// const current = [3, 1, 4, 3, 2];
// const newMap = current.map(x => x * 2);
// console.log(newMap);

// FILTER
// filter returns a new array containing the array elements that passed a specified test condition
// const current = [3, 1, 4, 3, 2];
// const newFilter = current.filter(x => x > 2);
// console.log(newFilter);

// REDUCE
// reduce boils ("reduces") all array elements down to one single value (eg. adding all elemnets together)
// No new array is given, only the reduced value
// ONLY EXAMPLE: CAN DO MANY OTHER THINGS
// const current = [3, 1, 4, 3, 2];
// const newReduce = current.reduce(
//   (accumulator, currentValue) => accumulator + currentValue
// );
// console.log(newReduce);

// /////////////////////////////////////////////////////////////////// 150. The map Method
// // From above
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;
// // const movementsToUSD = movements.map(function (mov) {
// //   return mov * eurToUsd;
// // });
// // Challenge: convert to arrow function
// const movementsToUSD = movements.map(mov => mov * eurToUsd);
// console.log(movements);
// console.log(movementsToUSD);

// //Exactly the same as
// const movementsToUSDfor = [];
// for (const mov of movements) movementsToUSDfor.push(mov * eurToUsd);
// console.log(movementsToUSDfor);
// // With map, we use a function to create a new array
// // With the loop, we loop through an array and manually create a new array

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'depoisted' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescriptions);

// ///////////////////////////////////// 152. The filter Method
// // From above
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposits = movements.filter(mov => mov > 0);
// console.log(movements);
// console.log(deposits);

// // Using for loop
// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// ///////////////////////////////////////////////////////////// 153. The reduce Method
// // From above
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);

// // accumlator => SNOWBALL..........(accumlator, current, index, array)
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Number ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// // 0 is thw innital value to start the counter
// console.log(balance);

// // For loop
// let balanceFor = 0;
// for (const mov of movements) balanceFor += mov;
// console.log(balanceFor);

// // Arrow function
// const balanceArr = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balanceArr);

// // Can do alot more than add values
// // Max value
// const max = movements.reduce(function (acc, cur) {
//   if (acc > cur) {
//     return acc;
//   } else {
//     return cur;
//   }
// }, movements[0]);
// console.log(max);

// // Same but nicer
// const maxValue = movements.reduce((acc, cur) => {
//   if (acc > cur) return acc;
//   else return cur;
// }, movements[0]);
// console.log(maxValue);

//////////////////////////////////////////////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// Jamie Solution
// const calcAverageHumanAge = function (ages) {
//   const ageInHumanYears = ages.map(function (dogAge) {
//     if (dogAge <= 2) return dogAge * 2;
//     else return dogAge * 4 + 16;
//   });
//   console.log(`All dog ages:    ${ageInHumanYears}`);

//   const adultDogs = ageInHumanYears.filter(age => age >= 18);
//   console.log(`Dogs 18 or over: ${adultDogs}`);

//   const ageAverage =
//     adultDogs.reduce(function (acc, age) {
//       return acc + age;
//     }) / adultDogs.length;
//   console.log(`Average age: ${ageAverage}`);
// };

// const test1 = [5, 2, 4, 1, 15, 8, 3];
// const test2 = [16, 6, 10, 5, 6, 1, 4];

// calcAverageHumanAge(test1);
// calcAverageHumanAge(test2);

// // Lecture Solution
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);

//   const adults = humanAges.filter(age => age >= 18);
//   console.log(adults);

//   const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
//   console.log(average);
//   // Another way to get average => divide by array length every time
//   // const average = adults.reduce((acc, age, i, arr) => acc + age / arr.length,0);
//   // console.log(average);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// //////////////////////////////////////////////////////// 155. The Magic of Chaining Methods
// // From above
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUSD = 1.1;
// // PIPELINE
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0) // Filter out only deposits
//   .map((mov, i, arr) => {
//     // SPLIT arror function into code block to add console.log();
//     // console.log(arr); // Use if you want to inspect
//     return mov * eurToUSD;
//   })
//   //.map(mov => mov * eurToUSD) // Apply conversion to deposits
//   .reduce((acc, mov) => acc + mov, 0); // Add values together

// console.log(totalDepositsUSD);

///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// //////////////////////////////////////////////////////////////157. The find Method
// // Used to retrieve one element of an array based on a condition
// // From above
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // Will only return first value that meets condition, NOT a new array
// const firstWithdrawl = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawl);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === `Jessica Davis`);
// console.log(account);

// // Challenge, change to for of loop
// const accountFor = function (accs) {
//   for (const acc of accs) {
//     if (acc.owner === `Jessica Davis`) return acc;
//   }
// };
// console.log(accountFor(accounts));

// /////////////////////////////////////////////////////////////////////161. some and every
// // From above
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const names = ['jamie', 'raquel', 'pilar', 'barry'];
// console.log(movements);
// // .includes returns true if any value is equal to what you are searching for
// //EQUALITY
// console.log(movements.includes(-130));
// console.log(movements.includes(30));
// console.log(names.includes('barry'));
// console.log(names.includes('chloe'));

// //some
// // CONDITION: SOME
// movements.some(mov => mov === -130);

// const anyDeposit = movements.some(mov => mov > 1500);
// console.log(anyDeposit);

// // CONDITION: EVERY
// // Will only return true if every condition satafies the condition
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0)); // account4 only has positive values

// // Separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// //////////////////////////////////////////////////////////// 162. flat and flatMap
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// // .flat() will take all smaller arrays and add them to the main array
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat()); // Will only work one level deep
// console.log(arrDeep.flat(2)); // Can select how deep you want to go

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallMovements = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallMovements);

// /////////////////////////// Chaining
// // flat
// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// // flatMap
// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

// /////////////////////////////////////////////////////////////////// 163. Sorting Arrays
// // EXAMPLE OF javaScript's built in sorting array

// // Strings
// const owners = ['Jamie', 'Raquel', 'Barry', 'Chloe'];
// console.log(owners.sort()); // Mutates the origional array
// console.log(owners);

// // Numbers
// // From above
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements); //Doesn't work

// // return <0, A, B (keep order)
// // return >0, B, A (switch order)
// // Ascending
// // movements.sort((a, b) => {
// //   if (a > b) return 1; //(keep order)
// //   if (a < b) return -1; //(switch order)
// // });
// movements.sort((a, b) => a - b); // Same as above
// // if a > b => a-b will return a positive number (it doesn't have to be 1)
// // if a < b => a-b will return a negative number (it doesn't have to be -1)
// console.log(movements);

// // Descending
// // movements.sort((a, b) => {
// //   if (a < b) return 1; //(keep order)
// //   if (a > b) return -1; //(switch order)
// // });
// movements.sort((a, b) => b - a);
// console.log(movements);

// ///////////////////////////////////////// 164. More Ways of Creating and Filling Arrays
// console.log([1, 2, 3, 4, 5, 6, 7]);
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // Empty arrays + fill method
// const x = new Array(7); // This will create an array with 7 empty slots
// console.log(x);
// console.log(x.map(() => 5)); // Doesn't work
// console.log(x.fill(1)); // Will mutate the array
// console.log(x.fill(2, 3, 5)); // .fill(val, start, end)

// //Array.from
// const f = Array.from({ length: 7 }, () => 1);
// console.log(f);

// const g = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(g);

// console.log('=========Random Dice Rolls==========');
// const randomDiceRolls = Array.from({ length: 100 }, () => {
//   let n = Math.random();
//   n = Math.floor(n * 6 + 1);
//   return n;
// });
// console.log(randomDiceRolls);

// labelBalance.addEventListener('click', function (e) {
//   e.preventDefault();
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   // Use Array.from to create an array from the querySelectorAll() on the bank movements
//   // REMINDER: '.movements__value' is a node list and NOT an array
//   // then we map the array to extract the content we want from it
//   console.log(movementsUI);

//   // Chalenge: Usign spread operator and mapping
//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
//   console.log(movementsUI2);
//   //const movementsUI2Map = el => Number(el.movementsUI2.replace('€', ''));
//   const movementsUI2Map = movementsUI2.map(cur =>
//     Number(cur.textContent.replace('€', ''))
//   );
//   console.log(movementsUI2Map);
// });

////////////////////////////////////////////165. Summary: Which Array Method to Use?
// We have seen 23 array methods
// How to choose

// What do you want to do?

// ===================To mutate original array===================
// - Add to oridinal:
// == .push() (end)
// == .unshift() (start)
// - Remove from original
// == .pop() (end)
// == .shift() (start)
// == .splice() (any)
// - Others
// == .reverse()
// == .sort()
// == .fill()

// ===================A new array===================
// - Computed from original
// == map() (loop)
// - Filtered using condition
// == .filter()
// - Portion of original
// == .slice()
// - Adding original to other
// == .concat()
// - Flattening the original
// == .flat()
// == .flatMap()

// ===================An array index===================
// - Based on value (looks only for value)
// == .indexOf()
// - Besed on test condition (looks for anything that meets condition, ie val>1)
// == .findIndex()

// ===================An array element===================
// - Based on test condition
// == .find()

// ===================Know if array includes===================
// - Based on value
// == .includes()
// - Besed on test condition
// == .some()
// == .every()
// (All of these will return a boolean)

// ===================A new string===================
// -Based on separator string
// == .join()

// ===================To transform to value===================
// - Based on accumulator
// == .reduce()
// (Boil down array to single value of any topic: Number, String, boolean, new array or object)

// ===================To just loop array===================
// - Based on callback
// == .forEach()
// (Does not create a new array, just loops over it)

// ////////////////////////////////////////////////////////////166. Array Methods Practice
// // 1. Add all deposits in the bank
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum);

// // 2. How many deposits with at least 1000$
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numDeposits1000);

// const numDeposits10002 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// console.log(numDeposits10002);

// // Prefixed ++ operator
// // let a = 10;
// // console.log(a++);
// // console.log(a);
// // console.log(++a);

// // 3. Create new object which contains the sums of all deposits and withdrawls
// const { deposits, withdrawls } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       //cur > 0 ? (sums.deposits += cur) : (sums.withdrawls += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawls'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawls: 0 }
//   );
// console.log(deposits, withdrawls);

// // 4. Create Simple function to convert any string to title case
// // this is a nice title => This Is a Nice Title
// const convertTitleCase = function (title) {
//   const capitzalize = str => str[0].toUpperCase() + str.slice(1);

//   const expections = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(
//       word => (expections.includes(word) ? word : capitzalize(word))
//       // if expections.includes(word), return word, else return first letter Uppercase
//     )
//     .join(' ');
//   return capitzalize(titleCase);
// };
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

//////////////////////////////////////////////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/

// // Jamie Solution
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];
// console.log(dogs);

// //1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
// const recFood = function (dogs) {
//   dogs.forEach(function (dog) {
//     dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
//   });
// };
// recFood(dogs);
// console.log(dogs);

// // 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
// //const tooMuch = (currentFood, recommendedFood) => currentFood > recommendedFood;
// // Might use later
// const findDogFromOwner = function (dogs, owner) {
//   dogs.forEach(function (dog) {
//     if (dog.owners.includes(owner)) {
//       console.log(
//         `${owner}'s dog has too ${
//           dog.curFood > dog.recommendedFood ? 'much' : 'little'
//         } food`
//       );
//     }
//   });
// };
// findDogFromOwner(dogs, 'Sarah');

// // 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood < dog.recommendedFood)
//   .flatMap(dog => dog.owners);
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood > dog.recommendedFood)
//   .flatMap(dog => dog.owners);

// // 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat to much`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat to little`);

// // 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// // 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
// // HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
// const dogEatOkay = dog =>
//   dog.curFood < dog.recommendedFood * 1.1 &&
//   dog.curFood > dog.recommendedFood * 0.9;
// console.log(dogs.some(dogEatOkay));

// // 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
// console.log(dogs.filter(dogEatOkay).flatMap(dog => dog.owners));

// // 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
// const dogsCopy = dogs
//   .slice()
//   .sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(dogsCopy);

// // Lecturn solution
// // 1.
// dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
// // 2.
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);
// console.log(
//   `Sarah's dog is eating too ${dogSarah.recFood ? 'much' : 'little'}`
// );
// // 3.
// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood)
//   .flatMap(dog => dog.owners);
// console.log(ownersEatTooLittle);
// // 4.
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little`);
// // 5.
// console.log(dogs.some(dog => dog.curFood === dog.recFood));
// // 6.
// const checkEatingOkay = dog =>
//   dog.curFood < dog.recFood * 1.1 && dog.curFood > dog.recFood * 0.9;
// console.log(dogs.some(checkEatingOkay));
// // 7.
// console.log(dogs.filter(checkEatingOkay));
// // 8.
// const dogsSorted = dogs
//   .slice()
//   .sort((a, b) => a.recFood - b.recFood);

// console.log(dogsSorted);
