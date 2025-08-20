
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

    const userSignature = document.getElementById("userSignature").value;
    const text = document.getElementById("text").value


    const comment = {
        userSignature: userSignature,
        text: text

    };
    try{
        const response = await fetch("http://localhost:8080/api/comments",{
            method:"POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(comment)
        });
        if(response.ok){
            const savedComment = await response.json();

            alert("Success! Comment submitted :) ");
            console.log("Saved: ",savedComment);
            document.getElementById("commentForm").reset();
            fetchComments();

        } else {
            alert("Error occurred during submission :(");
        }}
        catch(error){
            console.error("Error",error);
            alert("Could not connect to api :(")
        }

}

async function fetchComments(){

    try{
        const responce = await fetch("http://localhost:8080/api/comments");
        if(!responce.ok){
            throw new Error("failed to fetch comments");

        }
        const comments = await responce.json();
        const commentSectionContainer = document.getElementById("commentSectionContainer");

        commentSectionContainer.innerHTML = "";

        comments.forEach(comment =>{

            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");

            commentDiv.innerHTML = `<p><strong>${comment.userSignature || "Anonymous"}</strong> (${comment.timeStamp || "Just now"})</p>
                <p>${comment.text}</p>
                <hr> `;

            commentSectionContainer.appendChild(commentDiv);
            }
        )

    } catch (error){
        console.error("Error occurred while loading the comments",error)
    }


}


document.getElementById("commentForm").addEventListener("submit", handleCommentSubmit);
getAdviceBtn.addEventListener('click',fetchAdvice);
document.addEventListener("DOMContentLoaded", fetchComments);