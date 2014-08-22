svg = d3.select("#vis2").append("svg")
svg.attr
  width: 600
  height: 400


worldData = [
  {name:"homer"
  age:45}
  {name:"maggie"
  age:3}
  {name:"march"
  age:42}
  {name:"bart"
  age:14}
  {name:"lisa"
  age:13}
  {name:"grandpa"
  age:88}
]

data=[]
for i in [1..3]
  data.push(worldData.pop())

names = data.reduce(((old, d) -> old.concat(d.name)),[])

console.log names