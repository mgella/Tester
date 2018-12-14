$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    smokeRateData = [],
    heartRateData = [],
    humidityData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: humidityData
      }
    ]
  }

   var data3 = {
                  labels: timeData,
                  datasets: [
                             {
                             fill: false,
                             label: 'Smoke',
                             yAxisID: 'Smoke',
                             borderColor: "rgba(255, 204, 0, 1)",
                             pointBoarderColor: "rgba(255, 204, 0, 1)",
                             backgroundColor: "rgba(255, 204, 0, 0.4)",
                             pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                             pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                             data: smokeRateData
                             }
                             ]
                  }

                  var data4 = {
                  labels: timeData,
                  datasets: [
                             {
                             fill: false,
                             label: 'Heart',
                             yAxisID: 'Heart',
                             borderColor: "rgba(255, 204, 0, 1)",
                             pointBoarderColor: "rgba(255, 204, 0, 1)",
                             backgroundColor: "rgba(255, 204, 0, 0.4)",
                             pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                             pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                             data: heartRateData
                             }
                             ]
                  }

  var basicOption = {
    title: {
      display: true,
      text: 'Temperature & Humidity Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity(%)',
            display: true
          },
          position: 'right'
        }]
    }
  }

  var basicOption3 = {
                  title: {
                  display: true,
                  text: 'Smoke Real-time Data',
                  fontSize: 36
                  },
                  scales: {
                  yAxes: [{
                          id: 'Smoke',
                          type: 'linear',
                          scaleLabel: {
                          labelString: 'Smoke',
                          display: true
                          },
                          position: 'left',
                          }]
                  }
                  }


   var basicOption4 = {
                  title: {
                  display: true,
                  text: 'Heart Rate Real-time Data',
                  fontSize: 36
                  },
                  scales: {
                  yAxes: [{
                          id: 'Heart',
                          type: 'linear',
                          scaleLabel: {
                          labelString: 'Heart',
                          display: true
                          },
                          position: 'left',
                          }]
                  }
                  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var ctx3 = document.getElementById("myChart3").getContext("2d");
  var ctx4 = document.getElementById("myChart4").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });
  var myLineChart3 = new Chart(ctx3, {
    type: 'line',
    data: data3,
    options: basicOption3
  });
  var myLineChart4 = new Chart(ctx4, {
    type: 'line',
    data: data4,
    options: basicOption4
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.temperature) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.temperature);
      smokeRateData.push(obj.smokeRate);
      heartRateData.push(obj.heartRate);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }
      
      myLineChart.update();
      myLineChart3.update();
      if(obj.contact == 0) // there's no contact if contact ==1
      myLineChart4.update();
    $("#label1").html(obj.heartRate);
    $("#label2").html(obj.temperature);
    $("#label3").html(obj.humidity);
    $("#label4").html(obj.smokeRate);
    var msg="Great Job ! You are not smoking and your heart rate is normal!";
    var msg2="Your perspiration is noramal!"
    $("#label5").html(msg);
    $("#label6").html(msg2);
    if(obj.smokeRate>3000&&obj.smokeRate<7000){
      msg = "Please Stop Smoking";

      $("#label5").html(msg);
    }
    if(obj.humidity>99){
      msg2 = "Your perspiration is high!";

      $("#label6").html(msg2);
    }
    }
    catch (err) {
      console.error(err);
    }
  }
});
