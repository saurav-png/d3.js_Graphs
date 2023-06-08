const sizeOfSVG={
    width: 900,
    height: 500
};

const padding= 40

const title=() =>{
    return d3.select('main')
            .append('h1')
            .attr('id','title')
            .text("Doping In A Cycling Race")
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
    .style('position', 'absolute')
};

const scalingData=(year,seconds) =>{
    const minYear=d3.min(year,(d)=> d)
    const maxYear=d3.max(year,(d)=> d)
    const maxSec=d3.max(seconds,(d) => d)
    const xScale=d3.scaleLinear()
                    .domain([minYear, maxYear])
                    .range([padding,sizeOfSVG.width - padding/2])
            
    const yScale=d3.scaleTime()
                    .domain([0,maxSec])
                    .range([sizeOfSVG.height - padding, padding]);

    return {xScale,yScale}
}


const axes= (scales,svg) => {
    svg.append('g')
            .attr('id','x-axis')
            .call(d3.axisBottom(scales.xScale))
            .attr('transform',`translate(0, ${sizeOfSVG.height - padding})`)

    svg.append('g')
    .attr('id','y-axis')
    .call(d3.axisLeft(scales.yScale))
    .attr('transform',`translate(${padding},0)`)

}

const circlePoints=(year, seconds,scales) => {
    svg.selectAll('circle')
        .data(year)
        .enter()
            .append('circle')
            .attr('class','dot')
            .attr('r',5)
            .attr('data-xvalue', (d, i) => year[i])
            .attr('data-yvalue', (d, i) => new Date(seconds[i] * 1000))
}

let requestData=new XMLHttpRequest();
const sendRequest=(requestData)=>{
    const url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
    requestData.open("GET",url,true) //asynchronous data of boolean true
    return requestData;
};

requestData.onload=() =>{
    let year=[]
    let seconds=[]
    values=JSON.parse(requestData.responseText);
    values.forEach(elements =>{
        year.push(elements.Year)
        seconds.push(elements.Seconds)
    });
    const scales=scalingData(year,seconds)
    axes(scales,svg)
    circlePoints(year,seconds,scales)
}

const heartOfScatterplot=() => {
    title();
    svg=canvas();
    tooltip();
    requestData=sendRequest(requestData);
    requestData.send();
}
heartOfScatterplot()