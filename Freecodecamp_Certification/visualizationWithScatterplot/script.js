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
             .style('opacity', 0);
};

const scalingData=(year,seconds) =>{
    const minYear=d3.min(year,(d)=> d-1) // -1 is to not shift position of circle from y-axis
    const maxYear=d3.max(year,(d)=> d+1) // +1 is to to not shift position of circle from y-axis
    const minSec=d3.min(seconds,(d) => new Date(d *(1000 -1))) // -1 is to not shift position of circle from x-axis
    const maxSec=d3.max(seconds,(d) => new Date(d *(1000 +1))) // +1 is to not shift position of circle from x-axis
    const xScale=d3.scaleLinear()
                    .domain([minYear, maxYear])
                    .range([padding,sizeOfSVG.width - padding/2])
            
    const yScale=d3.scaleTime()
                    .domain([minSec,maxSec])
                    .range([sizeOfSVG.height - padding, padding]);

    return {xScale,yScale}
}


const axes= (scales,svg) => {
    svg.append('g')
            .attr('id','x-axis')
            .call(d3.axisBottom(scales.xScale).tickFormat(d3.format('d')))
            .attr('transform',`translate(0, ${sizeOfSVG.height - padding})`)

    svg.append('g')
    .attr('id','y-axis')
    .call(d3.axisLeft(scales.yScale).tickFormat(d3.timeFormat('%M:%S')))
    .attr('transform',`translate(${padding},0)`)

}

const circlePoints=(year, seconds,scales,otherInfo) => {
    svg.selectAll('circle')
        .data(year)
        .enter()
            .append('circle')
            .attr('class','dot')
            .attr('r',5)
            .attr('data-xvalue', (d, i) => year[i])
            .attr('data-yvalue', (d, i) => new Date(seconds[i] * 1000))
            .attr('data-identifier', (d, i) => year[i] + '-' + seconds[i])
            .attr('cx',(d) => scales.xScale(d))
            .attr('cy',(d,i) => scales.yScale(new Date(seconds[i] *1000)))
            .attr('fill', (d, i) => {
                if (otherInfo[i].Doping === '') {
                  return 'green';
                } else {
                  return 'red';
                }
              })
            
        .on('mouseover', function (e, d) {
            const circle = d3.select(this);
            const xValue = circle.attr('data-xvalue');
            const yValue = circle.attr('data-yvalue');
            const identifier = circle.attr('data-identifier');
            const index = seconds.findIndex((sec, i) => (year[i] + '-' + sec) === identifier);
            const dopingInfo = otherInfo[index].Doping === '' ? 'No allegations' : otherInfo[index].Doping;
            d3.select('#tooltip')
                .style('opacity', 1)
                .style('left', e.pageX + 'px')
                .style('top', e.pageY + 'px')
                .attr('data-year', xValue)
                .html(
                    `
                    <p><strong>Year:</strong> ${xValue} <strong>Time:</strong> ${otherInfo[index].Time}</p>
                    <p><strong>Place:</strong> ${otherInfo[index].Place}</p>
                    <p><strong>Name:</strong> ${otherInfo[index].Name} <strong>Nationality:</strong> ${otherInfo[index].Nationality}</p>
                    <p></p>
                    <p><strong>Doping:</strong> ${dopingInfo}</p>
                    `
                );
        })
    
            
            
            
        
    .on('mouseout',() => {
        return d3.select('#tooltip')
                    .style('opacity',0)
                    .style('left',0)
                    .style('top',0)
    });
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
    let otherInfo=[]
    values=JSON.parse(requestData.responseText);
    values.forEach(elements =>{
        year.push(elements.Year)
        seconds.push(elements.Seconds)
        let info = {
            Time: elements.Time,
            Place: elements.Place,
            Name: elements.Name,
            Nationality: elements.Nationality,
            Doping: elements.Doping,
          };
        otherInfo.push(info);
    })
    console.log(otherInfo)
    const scales=scalingData(year,seconds)
    axes(scales,svg)
    circlePoints(year,seconds,scales,otherInfo)
}

const heartOfScatterplot=() => {
    title();
    svg=canvas();
    tooltip();
    requestData=sendRequest(requestData);
    requestData.send();
}
heartOfScatterplot()

// Define the legend data
const legendData = [
    { label: 'Doping Allegation', color: 'red' },
    { label: 'No Allegations', color: 'green' }
];

// Create the legend
const legend = d3.select('#legend')

// Append legend items
const legendItems = legend.selectAll('.legend-item')
    .data(legendData)
    .enter()
        .append('div')
        .attr('class', 'legend-item')

// Append colored square boxes
legendItems.append('div')
    .attr('class', 'legend-box')
    .style('background-color', d => d.color)

// Append legend labels
legendItems.append('span')
    .attr('class', 'legend-label')
    .text(d => d.label)
