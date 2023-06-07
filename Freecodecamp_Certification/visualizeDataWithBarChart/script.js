// d3
    const sizeOfSVG={
        width: 900,
        height: 500
    };

    const padding={
        x:60,
        y:30
    };

    const title=() =>{
        return d3.select('main')
                .append('h1')
                .attr('id','title')
                .text("GDP of United States")
    };

    let svg
    const canvas=()=>{
        const svg=d3.select('main')
                    .append('svg')
                    .attr('width',sizeOfSVG.width)
                    .attr('height',sizeOfSVG.height)
        return svg
    };

    const tooltip=()=>{
        return d3.select('body')
        .append('div')
        .attr('id','tooltip')
    };

    let requestData=new XMLHttpRequest();
    const sendRequest=(requestData)=>{
        const url='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
        requestData.open("GET",url,true) //asynchronous data of boolean true
        return requestData;
    };


    const scalingData=(dates,gdpVal) => {
        const minDate=d3.min(dates,(d)=>new Date(d));
        const maxDate=d3.max(dates,(d)=> new Date(d));
        const maxGDP=d3.max(gdpVal,(d)=> d);

        const xScale=d3.scaleTime()  //scaleTime is used instead of scaleLinear as value is in date format
                        .domain([minDate,maxDate])
                        .range([padding.x,sizeOfSVG.width - padding.x / 2]) // 2 is divided as the same amt of padding isn't necessary at the end than used in the start
        const yScale=d3.scaleLinear()
                        .domain([0,maxGDP])
                        .range([sizeOfSVG.height - padding.y, padding.y]);

        return {xScale, yScale};
    }

    const axes= (scales,svg)=> {
        svg.append('g')
            .attr('id','x-axis')
            .call(d3.axisBottom(scales.xScale))
            .attr('transform',`translate(0, ${sizeOfSVG.height - padding.y})`)

        svg.append('g')
        .attr('id','y-axis')
        .call(d3.axisLeft(scales.yScale))
        .attr('transform',`translate(${padding.x},0)`)
        .attr('class','tick')

    }

    const makeBars=(dates,gdpVal,scales)=> {

        // adding colorscale for data
        const colorScale = d3.scaleLinear()
        .domain([0, gdpVal.length - 1])
        .range(["red", "green"]);
                
        svg.selectAll('rect')
            .data(gdpVal)
            .enter()
                .append('rect')
                .attr('x',(d,i) => scales.xScale(new Date(dates[i]))) //dates in the JSON isn't in date format so had to be converted first
                .attr('y',(d) => scales.yScale(d))
                .attr('width',(sizeOfSVG.width - padding.x)/ gdpVal.length)
                .attr('height',(d) => sizeOfSVG.height -scales.yScale(d) - padding.y)  
                .attr('fill',(d, i) => colorScale(i))
        }
   
    requestData.onload=() =>{
        const dates=[]
        const gdpVal=[]
        const datasetFromAPI=JSON.parse(requestData.responseText)
        datasetFromAPI.data.forEach(values =>{
            dates.push(values[0])
            gdpVal.push(values[1])
        }); //this selects the "data" from the objects and filters the value
    const scales= scalingData(dates,gdpVal);
    axes(scales,svg);
    makeBars(dates,gdpVal,scales)
    }
   
    const heartOfChart=() => {
        title();
        svg=canvas();
        tooltip();
        requestData=sendRequest(requestData);
        requestData.send();
    }
    heartOfChart()