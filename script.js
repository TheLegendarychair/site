
const adviceDiv = document.getElementById('advice')
const getAdviceBtn = document.getElementById('getAdvice')

async function fetchAdvice(){
    try{
        adviceDiv.textContent = "Loading...";
        const response = await fetch('https://api.adviceslip.com/advice');
        const data = await response.json();
        adviceDiv.textContent = `"${data.slip.advice}"`;
    }
    catch (error){
        adviceDiv.textContent = "Advice could not be fetched,possible API issue."
        console.error(error)
    }
}

getAdviceBtn.addEventListener('click',fetchAdvice)