

showMixed =()=> {
    document.getElementById("tableInfo").style.display="block";
    document.getElementById("info").style.display="none";
    document.getElementById("chart").style.display="none";
    fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather")
        .then(resp => resp.json())
            .then(weatherData => {
                let rowNumber = 1;
                let key;
                document.getElementById("h3").innerHTML = "Latest 30 measurements";
                document.getElementById("table").innerHTML = `
                    <tr id="heading">
                        <th class="sortHeader" onclick = "sortData(0)">№</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th class="sortHeader" onclick = "sortType(3)">Type</th>
                        <th class="sortHeader" onclick = "sortData(4)">Value</th>
                    </tr>
             `;
                for (let i = 0; i < 30; i++){
                    let date = weatherData[i].date_time.substring(0,10);
                    let time = weatherData[i].date_time.substring(11, 19);
                    if(Object.keys(weatherData[i].data)[0] === "temperature"){
                        key = "Temperature";
                    } else if (Object.keys(weatherData[i].data)[0] === "rain"){
                        key = "Rain";
                    } else if (Object.keys(weatherData[i].data)[0] === "wind_direction"){
                        key = "Wind direction";
                    } else if(Object.keys(weatherData[i].data)[0]=== "wind_speed"){
                        key = "Wind speed";
                    } else if(Object.keys(weatherData[i].data)[0]=== "light"){
                        key = "Light";
                    } else if(Object.keys(weatherData[i].data)[0]=== "humidity_out"){
                        key = "Humidity outside";
                    } else if(Object.keys(weatherData[i].data)[0]=== "humidity_in"){
                        key = "Humidity inside";
                    }
                    document.getElementById("table").innerHTML += `
                    <tr id="row">
                        <td id="num">${rowNumber}</td>
                        <td>${date}</td>
                        <td>${time}</td>
                        <td>${key}</td>
                        <td id="val">${Object.values(weatherData[i].data)[0]}</td>
                    </tr>
                    `;
                    rowNumber++;
                }
            }).catch(err => {
                    console.log(err);
                }); 
}




showInfo=()=>{
    if(weatherChart){
        weatherChart.destroy();
    }
    document.getElementById("tableInfo").style.display="none";
    document.getElementById("chart").style.display="none";
    document.getElementById("info").innerHTML =
        `
        <p>Name: Iurii Lozhkin.</p>
        <p>Email: iurii.lozhkin@tuni.fi.</p>
        <p>Course implementation: 3005.</p>
        <p>All 7 tiers are implemented. Tier 7 includes switching between dark and light modes and also has sorting feature.
        Sorting is implemented for columns "value", "type" and "№". Since date and time order matches with row numbers, I left time and date without sorting. </p>
        `
    if(document.getElementById("info").style.display == "block"){
        document.getElementById("info").style.display = "none";
    } else {
        document.getElementById("info").style.display = "block";
    }
}




let weatherChart = null;
const showChart=(axisX, axisY, chartTitle, chartType)=>{
    if(weatherChart){
        weatherChart.destroy();
    }
    const ctx = document.getElementById("chart").getContext("2d");
    Chart.defaults.global.defaultFontColor = "black";
    weatherChart = new Chart(ctx,{
        type: chartType,
        data: {
            labels: axisX,
            datasets: [{
                label: chartTitle,
                data: axisY,
                backgroundColor: "lightgreen"
            }],
        },
        options: {
            responsive: false,
            title:{
                display: true,
                text: document.getElementById("h3").innerHTML,
                fontSize: 15
            },
            scales:{
                xAxes: [{
                    gridLines:{
                        color: "gray"
                    }
                }],
                yAxes: [{
                    gridLines:{
                        color: "gray"
                    }
                }]
                
                
            }
        }
    });
}




showNow=(measurementAmount, weatherType, typeName, chartType)=>{
    document.getElementById("tableInfo").style.display="block";
    document.getElementById("info").style.display="none";
    document.getElementById("chart").style.display="block";
    fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather")
    .then(resp=>resp.json())
    .then(weatherData=>{
        let counter = 0;
        let j;
        for(let i = 0; i < 500; i++){
            if(Object.keys(weatherData[i].data)[0] === weatherType){
                counter++;
            }
        }
        if(counter >= measurementAmount){
            j = measurementAmount-1;
        } else {
            j = counter-1
        }
        let rowsTotal = j+1;
        let rowNumber = 1;
        document.getElementById("h3").innerHTML = "Latest " + rowsTotal + " " + typeName + " measurements";
        document.getElementById("table").innerHTML = `
            <tr id="heading">
                <th class="sortHeader" onclick = "sortData(0)">№</th>
                <th>Date</td>
                <th>Time</th>
                <th class="sortHeader" onclick = "sortData(3)">Value</th>
            </tr>
        `;
        let chartTime = [];
        let chartValues = [];
        for(let i = 0; i < 500; i++){
            if(Object.keys(weatherData[i].data)[0] === weatherType){
                let date = weatherData[i].date_time.substring(0,10);
                let time = weatherData[i].date_time.substring(11, 19);
                chartTime[j] = time;
                chartValues[j] = weatherData[i].data[weatherType];
                j--;
                document.getElementById("table").innerHTML += `
                <tr id="row">
                    <td id="num">${rowNumber}</td>
                    <td>${date}</td>
                    <td>${time}</td>
                    <td id="val">${weatherData[i].data[weatherType]}</td>
                </tr>
                `;
                rowNumber++;
                if (rowNumber === rowsTotal+1){
                    break;
                }
            }
        }
        showChart(chartTime, chartValues, typeName, chartType);
    }).catch(err=>{console.log(err);});
}

showHourly=(weatherType, hours, typeName, chartType)=>{
    document.getElementById("tableInfo").style.display="block";
    document.getElementById("info").style.display="none";
    document.getElementById("chart").style.display="block";
    fetch("http://webapi19sa-1.course.tamk.cloud/v1/weather/" + weatherType +"/"+ (hours-1))
    .then(resp=>resp.json())
    .then(weatherData=>{
        let rowNumber = 1;
        document.getElementById("h3").innerHTML = "Latest "+ (hours === 168 ? "week":hours+" hours") +" "+ typeName + " measurements";
        document.getElementById("table").innerHTML = `
            <tr id="heading">
                <th class="sortHeader" onclick = "sortData(0)">№</th>
                <th>Date</td>
                <th>Time</th>
                <th class="sortHeader" onclick = "sortData(3)">Value</th>
            </tr>
        `;
        let chartTime = [];
        let chartValues = [];
        for(let i = hours-1; i >= 0; i--){
            let date = weatherData[i].date_time.substring(0,10);
            let time = weatherData[i].date_time.substring(11, 19);
            chartTime[i] = time;
            chartValues[i] = weatherData[i][weatherType];
            document.getElementById("table").innerHTML += `
            <tr id="row">
                <td id="num">${rowNumber}</td>
                <td>${date}</td>
                <td>${time}</td>
                <td id="val">${weatherData[i][weatherType]}</td>
            </tr>
            `;
            rowNumber++;
        }
        showChart(chartTime, chartValues, typeName, chartType);
    }).catch(err=>{console.log(err);});
}


changeTheme=()=>{
    if(document.getElementById("theme").innerHTML === "Light mode"){
        document.getElementById("theme").innerHTML = "Dark mode";
        document.getElementById("theme").style.backgroundColor = "rgb(76, 91, 107)";
        document.getElementById("theme").style.color = "whitesmoke";
        document.body.style.backgroundColor = "whitesmoke";
        document.body.style.color = "black";
    } else {
        document.getElementById("theme").innerHTML = "Light mode";
        document.getElementById("theme").style.backgroundColor = "whitesmoke";
        document.getElementById("theme").style.color = "black";
        document.body.style.backgroundColor = "rgb(76, 91, 107)";
        document.body.style.color = "whitesmoke";
    }
}


let sortMade="no";
sortData=(ind)=>{
    let switchIt = true, a, b, sort, totalSwitches;
    let tableLength = table.rows.length;
    let rows = table.rows;
    if(sortMade === "no"){
        sort = "asc";
    }
    while(switchIt === true){
        totalSwitches = 0;
        for(let i = 1; i < tableLength-1; i++){
            a = parseFloat(table.rows[i].getElementsByTagName("td")[ind].innerHTML);
            b = parseFloat(table.rows[i+1].getElementsByTagName("td")[ind].innerHTML);
            if(sort === "asc"){
                if(a > b){
                    rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
                    totalSwitches++;
                }
            } else if(sort === "desc"){
                if(a < b){
                    rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
                    totalSwitches++;
                }
            }
        }
        if (totalSwitches === 0 && sort === "asc"){
            sortMade = "asc";
            switchIt = false;
        } else if (totalSwitches===0 && sort === "desc"){
            sortMade = "desc";
            switchIt = false;
        }
        sort = (sortMade==="asc") ? "desc":"asc";
    }
}


sortType=(ind)=>{
    let switchIt = true, a, b, sort, totalSwitches;
    let tableLength = table.rows.length;
    let rows = table.rows;
    if(sortMade === "no"){
        sort = "asc";
    }
    while(switchIt === true){
        totalSwitches = 0;
        for(let i = 1; i < tableLength-1; i++){
            a = table.rows[i].getElementsByTagName("td")[ind].innerHTML;
            b = table.rows[i+1].getElementsByTagName("td")[ind].innerHTML;
            if(sort === "asc"){
                if(a > b){
                    rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
                    totalSwitches++;
                }
            } else if(sort === "desc"){
                if(a < b){
                    rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
                    totalSwitches++;
                }
            }
        }
        if (totalSwitches === 0 && sort === "asc"){
            sortMade = "asc";
            switchIt = false;
        } else if (totalSwitches===0 && sort === "desc"){
            sortMade = "desc";
            switchIt = false;
        }
        sort = (sortMade==="asc") ? "desc":"asc";
    }
}