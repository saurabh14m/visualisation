svg = d3.select("#vis1").append("svg")
svg.attr
  width: 600
  height: 400

textField = d3.select("body").append("div").text("value")

d3.select("body").append("button").text("shuffle")
.on
    "click": -> updateData()

d3.select("body").append("button").text("change scale")
.on
    "click": -> changeScale()

d3.select("body").append("button").text("swap")
.on
    "click": -> swapX()


data= []


updateData = ->
  dataSize = (Math.random()*50+50)

  for i in [0..dataSize]
    data[i]=
      pos: i
      value: Math.random()*9999+1


updateData()
console.log data
