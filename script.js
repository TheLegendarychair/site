
const adviceDiv = document.getElementById('advice')
const getAdviceBtn = document.getElementById('getAdvice')

async function fetchAdvice(){
    getAdviceBtn.disabled = true;

    let dots = 1;

    adviceDiv.textContent = "Loading";


    //use an interval to keep generating and removing dots
    const dotsInterval = setInterval(()=>{
        dots = (dots % 3) + 1;
        adviceDiv.textContent = "Loading" + ".".repeat(dots);

        },400);



    try{
        adviceDiv.textContent = "Loading...";
        const response = await fetch('https://api.adviceslip.com/advice');
        const data = await response.json();
        adviceDiv.textContent = `"${data.slip.advice}"`;
        clearInterval(dotsInterval);
    }
    catch (error){
        adviceDiv.textContent = "Advice could not be fetched,possible API issue."
        console.error(error);
        clearInterval(dotsInterval);
    }
    getAdviceBtn.disabled = false;
}

getAdviceBtn.addEventListener('click',fetchAdvice)