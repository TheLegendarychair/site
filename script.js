
const adviceDiv = document.getElementById('advice')
const getAdviceBtn = document.getElementById('getAdvice')

async function fetchAdvice(){
    try{
        const responce = await fetch('https://api.adviceslip.com/advice');
        const data = await responce.json();
        adviceDiv.textContent = `"${data.slip.advice}"`;
    }
    catch (error){
        adviceDiv.textContent = "Advice could not be fetched,possible API issue."
        console.error(error)
    }
}

getAdviceBtn.addEventListener('click',fetchAdvice)