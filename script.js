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
  
  const displayMovements = function(movements,sort=false){
    // It will remove whatever present before and make it empty...
    containerMovements.innerHTML='';    //.textContent=0

// if sort is true then sort it otherwise let it be to follow the original order...

    const movs=sort?movements.slice().sort((a,b)=>a-b):movements;

      movs.forEach(function(mov,i){ 
      const type=mov>0?'deposit':'withdrawal'
      const html=`
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1}${type}</div>
      <div class="movements__value">${mov}</div>
    </div>`
    containerMovements.insertAdjacentHTML('afterbegin',html);  //jo phle daalenge wo nichhe chalta jaega...
    })
  }
 
  const updateUI=function(acc){
     // Display movements
     displayMovements(acc.movements)
     // Display balance
     calcPrintBalance(acc)
     // Display summary 
     calcDisplaySummary(acc)
  }


  
  const calcPrintBalance=function(account){
    account.balance=account.movements.reduce((acc,curr)=>acc+curr ,0);
    labelBalance.textContent=`${account.balance}€`;
  }



  const calcDisplaySummary=function(acc){
    const incomes=acc.movements
      .filter(mov => mov>0)
      .reduce((acc,mov) => acc+mov,0);
      labelSumIn.textContent=`${incomes}€`

    const out=acc.movements
      .filter(mov => mov>0)
      .reduce((acc,mov) => acc+mov,0);
      labelSumOut.textContent=`${out}€`

    const interest=acc.movements
      .filter(mov=>mov>0)
      .map(deposit=>(deposit*acc.interestRate)/100)  
      .reduce((acc,int)=>acc+int,0);
      labelSumInterest.textContent=`${interest}€`
  };
  calcDisplaySummary(account1)




  const createUserNames=function(accs){         //Adding userName to each object account
    accs.forEach(function(acc){
      acc.userName=acc.owner
        .toLowerCase()
        .split(' ')
        .map(function(name){
          return name[0];
        })
        .join('')
    })
  }
  createUserNames(accounts)
  // console.log(accounts);


  // Event handlers...
  let currentAccount;
  btnLogin.addEventListener('click',function(e){
    // Prevent form from submitting...
    e.preventDefault();

    // Account me new key-value pair add kie the userName:js/ss etc...
    currentAccount=accounts.find(acc=>acc.userName === inputLoginUsername.value);
    if(currentAccount?.pin===Number(inputLoginPin.value)){
      // Display UI and a welcome messsage...
      labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}`
      containerApp.style.opacity=100;

      // Clear input fields...
      inputLoginUsername.value=inputLoginPin.value=''
      inputLoginPin.blur()

      // update UI
     updateUI(currentAccount);
    }
  })

  btnTransfer.addEventListener('click',function(e){
    e.preventDefault();
    const amount=Number(inputTransferAmount.value);
    const recieveAcc=accounts.find(
      acc=>acc.userName===inputTransferTo.value
    );
    inputTransferAmount.value=inputTransferTo.value=''
    if(amount>0 && recieveAcc && amount<=currentAccount.balance && recieveAcc?.userName!== currentAccount.userName) {
      // Doing the transfer
      currentAccount.movements.push(-amount);
      recieveAcc.movements.push(amount);

      updateUI(currentAccount);
    }
    inputLoanAmount.value='';
  })



  btnLoan.addEventListener('click',function(e){
    e.preventDefault();
    const amount=Number(inputLoanAmount.value);

    if(amount>0 && currentAccount.movements.some(mov=>mov>=amount*0.1)){
    //  Add Movements
      currentAccount.movements.push(amount);

    // Update UI 
    updateUI(currentAccount);
    }
  })


  btnClose.addEventListener('click',function(e){
    e.preventDefault();
    inputCloseUsername.value=inputClosePin.value=''
     if(inputCloseUsername.value===currentAccount.userName && Number(inputClosePin.value===currentAccount.pin)){
      const index=accounts.findIndex(acc=>acc.userName===currentAccount.userName)
      accounts.splice(index,1);

      // Hide UI
      containerApp.style.opacity=0;
     }
  })



  let sorted=false;
  btnSort.addEventListener('click',function(e){
    e.preventDefault();
    displayMovements(currentAccount.movements,!sorted);
    sorted=!sorted;
  })