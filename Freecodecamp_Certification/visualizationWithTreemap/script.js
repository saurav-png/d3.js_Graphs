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

}


// fetching data
d3.json(gameDataURL).then(
    (data,error) =>{
        if(error){
            console.log(error)
        }else{
            moviedata=data
            console.log(moviedata)
            treeMapCreate()
        }
    }
)