let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");
let submit=document.querySelector("#submit");
let imagebtn=document.querySelector("#image");
let image=document.querySelector("#image img");

let imageinput =document.querySelector("#image input")

const Api_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAlg-et9LOZZm98HRxVproqXDqN0NCmvLQ";

let user = {
  message: null,
  file:{
    mime_type:null,
    data:null
  }
};
async function generateResponse(aiChatBox) {
  let text=aiChatBox.querySelector(".ai-chat-area");

    let RequesOption = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: user.message },(user.file.data?[{"inline_data":user.file}]:[])] }],
    }),
  };
  try{
      let response =  await fetch(Api_URL, RequesOption);
      let data = await response.json();
      let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
      text.innerHTML=apiResponse;
    //   console.log(apiResponse);
      
  }
  catch(err)
  {
    console.log(err);
    
  }
  finally{

      chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
      image.src=`img.svg`;
    image.classList.remove("choose");
    user.file={};
  }

  
}

function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add = classes;
  return div;
}
function handlechatResponse(message) {
    user.message=message;
  let html = `<div class="user-chat-box">
  <img src="user-286.png" alt="" id="userImage" width="8%">
  <div class="user-chat-area">
    ${user.message}
    ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>`:""}
    </div> </div>`;
  prompt.value = "";
  let userChatBox = createChatBox(html, "user-chat-box");
  chatContainer.appendChild(userChatBox);
  chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
  setTimeout(() => {
    let html = `<div class="ai-chat-box">
      <img src="chat.png" alt="" id="aiImage" width="8%">
      <div class="ai-chat-area">
                <img src="load1.webp" alt="" class="load" width="50px">
      
      </div>
      </div> `;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 600);
}

prompt.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    handlechatResponse(prompt.value);
  }
});
submit.addEventListener("click",()=>{
handlechatResponse(prompt.value);
});
imageinput.addEventListener("change",()=>
{
    const file=imageinput.files[0];
    if(!file)
    {
        return ;
    }
    let reader=new FileReader();
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1];
        user.file={
            mime_type:file.type,
            data:base64string,
        }
        image.src=`data:${user.file.mime_type};base64,${user.file.data}`;
        image.classList.add("choose");
    }

    reader.readAsDataURL(file);
})


imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click();
})
