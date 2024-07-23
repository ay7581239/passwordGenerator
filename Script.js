const inputSlider = document.getElementById('data-lenghtSlider');
const lengthDisplay = document.getElementById('data-length');
const passwordDisplay = document.getElementById('data-passwordDisplay');
const copybtn= document.getElementById('data-copy');
const copymsg = document.getElementById('data-copymsg');
const uppercasecheck= document.getElementById('uppercase');
const lowercasecheck = document.getElementById('lowercase');
const numbercheck = document.getElementById('num');
const symbolecheck = document.getElementById('Special');
const indicator = document.getElementById('strength-indicater');
const generatebtn = document.getElementById('butt');
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_+><?"}{|,./-=`';
let password = "";
let passwordlength = 10;
let checkCount = 1;  
handleSlider();
setIndicator("#ccc");
function handleSlider() { 
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordlength - min) * 100 / (max - min)) + "0% 100%";
    

}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max) {
   return Math.floor(Math.random() * (max - min))+ min ;
}

function getRdnNumber() {
    return getRandomInteger(0,9);
}

function generateLowcase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpcase() {
        return String.fromCharCode(getRandomInteger(65,91));

}

function generateSymboles() {
    const randnum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randnum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercasecheck.checked) hasUpper = true;
    if (lowercasecheck.checked) hasLower = true;
    if (numbercheck.checked) hasNum = true;
    if (symbolecheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasUpper || hasLower)&&(hasNum || hasSym)&& passwordlength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }

}

async function copyContent() {
    try {
            await navigator.clipboard.writeText(passwordDisplay.value);
            copymsg.innerText = "Copied";
    }
    catch (e) {
        copymsg.innerText = "Failed";
    }
    // to make copy wala span visible
    copymsg.classList.add("active");

    setTimeout(() => {
        copymsg.classList.remove("active");

    }, 2000);

}

function sufflePassword(Array){
    //Fisher Yates Suffle Algorithms
    for (let i = Array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    }
    let str = "";
    Array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange() {
    checkCount = 0;
    allcheckbox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });
    //Special Condition
    
    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }
}

allcheckbox.forEach((checkbox)=> {
    checkbox.addEventListener('change', handleCheckBoxChange);  
})

inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleSlider();
})

copybtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
    passwordDisplay.value = "";
})

generatebtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if (checkCount == 0)
        return;
    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }
    console.log("Start ");
    // remove old password 
    password = "";
    
    let funArr = [];
    if (uppercasecheck.checked) 
        funArr.push(generateUpcase);
    
     if (lowercasecheck.checked) 
        funArr.push(generateLowcase);
    
     if (numbercheck.checked) 
        funArr.push(getRdnNumber);
    
     if (symbolecheck.checked) 
        funArr.push(generateSymboles);
    //cumpolsury addition
    for (let i = 0; i < funArr.length; i++){
        password += funArr[i]();
    }
    console.log("Cumplsory ");
        //Remaining Addition
    for (let i = 0; i < passwordlength-funArr.length; i++){
        let randI = getRandomInteger(0,funArr.length);
        //console.log("randi"+randI);
        password += funArr[randI]();
    }
    //console.log("Remaining ");
//Suffle Password
    password = sufflePassword(Array.from(password));
console.log("Suffle Done ");
    //show in ui
     passwordDisplay.value = password;
console.log("Ui addtion");
    //claculate 
    calcStrength();
     
})