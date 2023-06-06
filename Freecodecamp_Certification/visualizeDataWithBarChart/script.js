// d3
    const sizeOfSVG={
        width: 900,
        height: 500
    };

    const padding = 60;

    const title=() =>{
        return d3.select('main')
                .append('title')
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
    const sendRequest=()=>{
        const url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
        requestData=(GET,url,true) //asynchronous data of boolean true
    };

    requestData.onload=() =>{
        const dates=[]
        const gdpVal=[]
        const datasetFromAPI=JSON.parse(requestData.responseText())
        datasetFromAPI.data.forEach(values =>{
            dates.push(values[0])
            gdpVal.push(values[0])
        }); //this selects the "data" from the objects and filters the value
    }
    const heartOfChart=() => {
        title();
        svg=canvas();
        tooltip();
        requestData=sendRequest(requestData);
        requestData.send();
    }