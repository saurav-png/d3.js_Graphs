const sizeOfSVG={
    width: 900,
    height: 600
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

let requestData=new XMLHttpRequest();
const sendRequest=(requestData)=>{
    const url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
    requestData.open("GET",url,true) //asynchronous data of boolean true
    return requestData;
};


const heartOfScatterplot=() => {
    title();
    svg=canvas();
    tooltip();
    requestData=sendRequest(requestData);
    requestData.send();
}
heartOfScatterplot()