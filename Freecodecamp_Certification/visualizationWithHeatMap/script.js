// fetching data
    let requestData=new XMLHttpRequest();
        const url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
        requestData.open("GET",url,true)
        requestData.onload = ()=>{
            console.log(requestData.responseText)
        }
        requestData.send()


// sizes
    const sizeOfSVG={
        width: 900,
        height: 600
    };

    const padding= 40

const title=d3.select('main')
                .append('h1')
                .attr('id','title')
                .text("Heat Map")


const canvas=d3.select('main')
                .append('svg')
                .attr('width',sizeOfSVG.width)
                .attr('height',sizeOfSVG.height)

