
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




async function  handleCommentSubmit(e){
    //e = event

    e.preventDefault();

    const Username = document.getElementById("Username").value;
    const text = document.getElementById("text").value;


    const comment = {
        Username: Username,
        text: text

    };
    try{
        const response = await fetch("http://localhost:5169/comments",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(comment)
        });
        if(response.ok){
            const savedComment = await response.json();

            alert("Success! Comment submitted :) ");
            console.log("Saved: ",savedComment);
            document.getElementById("commentForm").reset();

        } else {
            alert("Error occurred during submission :(");
        }}
        catch(error){
            console.error("Error",error);
            alert("Could not connect to api :(");
        }

}
//
//https://api.kulikovskii.me/api/comments

async function fetchComments() {
    try {
        const response = await fetch("http://localhost:5169/comments");

        if (!response.ok) {
            throw new Error("Failed to fetch comments");
        }

        const comments = await response.json();
        const commentSectionContainer = document.getElementById("commentSectionContainer");
        commentSectionContainer.innerHTML = "";

        comments.forEach(comment => {
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");

            commentDiv.innerHTML = `
                <p><strong>${comment.Username || "Anonymous"}</strong> 
                (${comment.timeStamp ? new Date(comment.timeStamp).toLocaleDateString("en-GB",{
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }) : "__"})</p>
                <p>${comment.text}</p>
                <hr>
            `;

            commentSectionContainer.appendChild(commentDiv);
        });

    } catch (error) {
        console.error("Error occurred while loading the comments", error);
    }
}



async function fetchLeaderboard() {
    try {
        const response = await fetch("https://api.kulikovskii.me/api/scores/top");
        if (!response.ok) throw new Error("Failed to fetch leaderboard ");

        const scores = await response.json();

        const leaderboardContainer = document.getElementById("leaderboardContainer");
        leaderboardContainer.innerHTML = "";

        scores.forEach((score, index) => {
            const div = document.createElement("div");
            div.classList.add("leaderboard-entry");
            div.innerHTML = `
                <p><strong>${index + 1}. ${score.Username}</strong> — ${score.score}</p>
            `;
            leaderboardContainer.appendChild(div);
        });

    } catch (error) {
        console.error("Error loading leaderboard:", error);
    }
}

function submitScore(){

}

document.addEventListener('touchstart', function preventZoom(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  } }, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function preventDoubleTap(e) {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault(); 
  }
  lastTouchEnd = now;
}, false);


document.getElementById("commentForm").addEventListener("submit", handleCommentSubmit);
getAdviceBtn.addEventListener('click',fetchAdvice)
document.addEventListener("DOMContentLoaded", fetchComments);
document.addEventListener("DOMContentLoaded",fetchLeaderboard);