// sizes
    const sizeOfSVG={
        width: 1200,
        height: 600
    };

    const padding= 60

// create Heading of the project
    const title=d3.select('main')
                    .append('h1')
                    .attr('id','title')
                    .text("Monthly Global Land-Surface Temperature")

// create description title
    const description=(baseTemperature) =>{
        return d3.select('main')
                    .append('h2')
                    .attr('id','description')
                    .text(`1753 - 2015: Base Temperature ${baseTemperature}°C`)
}

// draw the canvas to display svg
    const canvas=()=>{
        return d3.select('main')
                    .append('svg')
                    .attr('width',sizeOfSVG.width)
                    .attr('height',sizeOfSVG.height)
}

// generate scales
    let xScale
    let yScale
    scales=() =>{
        xScale=d3.scaleLinear()
                    .range([padding, sizeOfSVG.width -padding])
        yScale= d3.scaleTime()
                    .range([padding, sizeOfSVG.height-padding])
    }


// generate axes
let svg
    axes=() =>{
        let xAxis= d3.axisBottom(xScale)
        let yAxis= d3.axisLeft(yScale)
        svg.append('g')
                .call(xAxis)
                .attr('id','x-axis')
                .attr('transform',`translate(0, ${sizeOfSVG.height - padding})`)

        svg.append('g')
            .call(yAxis)
            .attr('id','y-axis')
            .attr('transform',`translate(${padding},0)`)
    }


let baseTemperature
let monthlyVariance=[]
// fetching data
    let requestData=new XMLHttpRequest();
        const url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
        requestData.open("GET",url,true)
        requestData.onload = ()=>{
            let dataset=JSON.parse(requestData.responseText)
            baseTemperature=dataset.baseTemperature
            monthlyVariance=dataset.monthlyVariance
            console.log(baseTemperature)
            console.log(monthlyVariance)
            description(baseTemperature)
            svg=canvas()
            scales()
            axes()
        }
        requestData.send()