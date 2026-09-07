//  string number boolean -- data types

// variables-- 

// comments 

// operators

// func,array , objects 

// Dom Manipulation

const searchBox=document.querySelector("#search-box");
const searchBtn=document.querySelector("#search-btn");
const weatherIcon = document.querySelector(".weather-icon");
const temp = document.querySelector(".temp");
const city = document.querySelector(".city");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const historyList = document.querySelector("#history-list");

// functions ans its async behaviour 
function demo(){
  console.log("1");
  setTimeout(()=>{
    console.log("2");
  },2000)
  console.log("3");
}
demo(); // call

// get coord func 

async function getCoordinates(cityName){
  try{
    let url=`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`;
    let response=await fetch(url);
    console.log("hii...",response);
    let data= await response.json(); // .json convert data into js object
    console.log("data...",data);
    if (!data.results || data.results.length === 0) {
      throw new Error("City not found!");
    }
    return {
      name: data.results[0].name,
      lat: data.results[0].latitude,
      lon: data.results[0].longitude,
    }
  }
  catch(err){
    console.log("err...",err);
    return null;
  }
}

// getCoordinates("New Delhi").then(coords => console.log("get coord...", coords));

// get weather func from open-meteo api 
// API -- application programming interface


async function getWeather(cityName){
  const coords=await getCoordinates(cityName);
  if(!coords) return;

  try{
     let url=`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;
     const response= await fetch(url);
     const data =await response.json();
     console.log("weather data---",data);
     console.log("data of objects ...",data.current_weather.windspeed)

     city.innerHTML=coords.name;
     temp.innerHTML=`${data.current_weather.temperature}°C`;
     humidity.innerHTML="NA";
     wind.innerHTML= `${data.current_weather.windspeed} km/h`;

     let code=data.current_weather.weathercode;
     console.log("code...",code);
     weatherIcon.src="./images/"+getWeatherIcon(code);

     // save to History
     addToHistory(coords.name);


  }catch(err){
    console.error("Error fetching weather:", err);
  }
}

// getWeatherIcon func 
// here we learn what is array and how to use it if else function operators
// let weather=["sun.png","cloud.png",89,true];
// weather[0]=="sun.png"
// weather.includes("sun");--false

function getWeatherIcon(code){
   if(code===0) return "sun.png";
    if ([1, 2, 3].includes(code)) return "clouds.png";
    if ([45, 48].includes(code)) return "mist.png";
    if ([51, 61, 80].includes(code)) return "rain.png";
    if ([71, 73, 75].includes(code)) return "snow.png";
    return "clear.png";
}

console.log(getWeatherIcon(3)) // func debug

// how to add DOM element in history list
// localStorage
let searchHistory=JSON.parse(localStorage.getItem("weatherHistory"))|| [];

const addToHistory=(cityName)=>{
  if(!searchHistory.includes(cityName)){
    searchHistory.push(cityName);
    localStorage.setItem("weatherHistory",JSON.stringify(searchHistory));
    // as local storage save the data now we render it in sidebar
    renderHistory(); // calling of function
  }
}

// now we save the history in local storage but not render in sidebar so now we learn how to render it

function renderHistory(){
  historyList.innerHTML = "";
  searchHistory.forEach(el => {
    let li=document.createElement("li");
    li.textContent=el;
    historyList.appendChild(li);
  });
}

// now when search button click then it call getWeather func
searchBtn.addEventListener("click",()=>{
  if(searchBox.ariaValueMax.trim()!=""){
    getWeather(searchBox.value.trim());
  }
})

// same for enter key
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && searchBox.value.trim() !== "") {
    getWeather(searchBox.value.trim());
  }
});

window.onload=()=>{
  renderHistory();
  getWeather("ROPAR");
}