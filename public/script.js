const form = document.getElementById("form");
const weather = document.getElementById("weather");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    if(form.city.value === "" || form.state.value === "") {
        alert("Please enter a full address");
        return;
    }
    const formData = new FormData(form);
    const response = await fetch("/api", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    // render data to the HTML file
    const currentlyDiv = document.createElement("div");
    currentlyDiv.innerHTML = `
      <h2>Current Weather in ${form.city.value + ", " + form.state.value}</h2>
      <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png" alt="weather icon"/>
      <p>Temperature: ${data.current.temp}°K</p>
      <p>Feels Like: ${data.current.feels_like}°K</p>
      <p>Humidity: ${data.current.humidity}%</p>
      <p>Wind Speed: ${data.current.wind_speed} km/h</p>
      <p>Clouds: ${data.current.clouds}%</p>
      <p>Visibility: ${data.current.visibility} m</p>
      <p>Weather: ${data.current.weather[0].main}</p>
      <p>Weather Description: ${data.current.weather[0].description}</p>
    `;

    const dailyDiv = document.createElement("div");
    dailyDiv.innerHTML = `
      <h2>7-Day Forecast</h2>
      <table>
        <tr>
          <th>Date</th>
          <th>Weather Icon</th>
          <th>Day Temp</th>
          <th>Humidity</th>
          <th>Wind Speed</th>
          <th>Clouds</th>
          <th>Visibility</th>
          <th>Weather</th>
          <th>Weather Description</th>
        </tr>
        ${data.daily.map((day) => `
          <tr>
            <td>${new Date(day.dt).toUTCString()}</td>
            <td><img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather icon"/><td>
            <td>${day.temp.day}°C</td>
            <td>${day.humidity}%</td>
            <td>${day.wind_speed} km/h</td>
            <td>${day.clouds}%</td>
            <td>${day.visibility} m</td>
            <td>${day.weather[0].main}</td>
            <td>${day.weather[0].description}</td>
          </tr>
        `).join("")}
    `;

    // clear the weather div before adding new data
    weather.innerHTML="";
    weather.appendChild(currentlyDiv);
    weather.appendChild(dailyDiv);

  
  } catch (error) {
    console.error(error);
  }
});
