const gameDataURL='https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'

let gameData

// create Heading & Description of the project
const title=d3.select('main')
                .append('div')
                .attr('id','title')
                .append('h1')
                .text("Video Game Sales")

const description=d3.select('main')
                    .append('div')
                    .attr('id','description')
                    .append('h4')
                    .text("Top 100 Most Sold Video Games Grouped by Platform")


// create canvas
const sizeOfCanvas={
    width: 1000,
    height: 600,
};

const canvas=d3.select('main')
                .append('svg')
                .attr('width',sizeOfCanvas.width)
                .attr('height',sizeOfCanvas.height)

treeMapCreate=() =>{

    let ladder=d3.hierarchy(gameData, (node) => node.children)
                 .sum((node) => node.value)
                 .sort((node1, node2) => node2.value - node1.value)
    
    let makeTreeMap = d3.treemap()
                        .size([sizeOfCanvas.width,sizeOfCanvas.height])


    makeTreeMap(ladder)

    gameTiles=ladder.leaves()
    console.log(gameTiles)


    // define color scale
    let categories = gameTiles.map((d) => {
        return d.data.category;
    });
    
    // Get the unique categories
    let uniqueCategories = [...new Set(categories)];

    let colorScale = d3.scaleOrdinal()
                        .domain(uniqueCategories)
                        .range(["#1f77b4",  //no schemeCategory20 so created our own
                                "#aec7e8",
                                "#ff7f0e",
                                "#ffbb78",
                                "#2ca02c",
                                "#98df8a",
                                "#d62728",
                                "#ff9896",
                                "#9467bd",
                                "#c5b0d5",
                                "#8c564b",
                                "#c49c94",
                                "#e377c2",
                                "#f7b6d2",
                                "#7f7f7f",
                                "#c7c7c7",
                                "#bcbd22",
                                "#dbdb8d",
                                "#17becf",
                                "#9edae5"])


    let rects = canvas.selectAll('g')
                        .data(gameTiles)
                        .enter()
                            .append('g')
    rects.append('rect')
            .attr('class','tile')
            .attr('fill',(d) =>{
                return colorScale(d.data.category)
            })
            .attr('x', (d) => d.x0)
            .attr('y', (d) => d.y0)
            .attr('width', (d) => d.x1 - d.x0)
            .attr('height', (d) => d.y1 - d.y0)
            .attr('data-name', (d) => d.data.name)
            .attr('data-category', (d) => d.data.category)
            .attr('data-value', (d) => d.data.value)

    rects.append('foreignObject')
            .attr('x', (d) => d.x0 + 2)
            .attr('y', (d) => d.y0 + 10)
            .style('font-size', 11)
            .attr('width', (d) => d.x1 - d.x0)
            .attr('height', (d) => d.y1 - d.y0)
            .html((d) => d.data.name)

}


// fetching data
d3.json(gameDataURL).then(
    (data,error) =>{
        if(error){
            console.log(error)
        }else{
            gameData=data
            console.log(gameData)
            treeMapCreate()
        }
    }
)