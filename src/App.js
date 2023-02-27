import {useState} from 'react'
import './App.css';
import axios from 'axios'
import { ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

const [input,setInput]=useState("")
const[output,setOutput]=useState("")

const inputDataHandler = (event)=>{
   //setInput({[event.target.name] : event.target.value})
   setInput(event.target.value)
  
  // console.log(event.target.value,event.target.name)

}


const getShortUrl= async (event)=>{
  try{
  event.preventDefault()
  console.log("input",input)
  let url={longUrl:input}
  console.log("url",url)
 const response = await axios.post("http://localhost:4000/url/shorten",url)

 if(response.status===200){
  toast.success(response.data.message)
  setOutput(response.data.data)
 console.log("alreadyshorten",response.data)

} else if(response.status===201){
  console.log("firsttime",response.data)
  toast.success(response.data.message)
  setOutput(response.data.data.shortUrl)

}
  }
  catch (err) {
    toast.error(err.response.data.message);
}
}




const shortAnother=(event)=>{
  event.preventDefault()
  setInput("")
  setOutput("")
}


  return (
    <div className='App'>
      <ToastContainer position='top-center'/>
    <form >
    <h1> Url Shortner</h1>
    <div>
      <h3> Your Long Url</h3> 
    <input type="text" name="longUrl" value={input} onChange={inputDataHandler}></input>
    </div>
    <div>
      <h3>  Tiny Url</h3>
      <input type="text" name="shortUrl" value={output} ></input>
    </div>
    <br></br>
    <div>
      <button  onClick={getShortUrl}>Make Tiny Url...</button>
      <button onClick={shortAnother}>Shorten Another Url...</button>
    </div>
    <br></br>
     {/* <h4>LongUrl  :  {input}</h4> */}
   <h3>short url <h4>{output}</h4> </h3>
    </form>
    </div>
  );
}

export default App;
