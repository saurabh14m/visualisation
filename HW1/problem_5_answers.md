### Questions

Consider the provided sample code [this Gist](http://bl.ocks.org/romsson/8639620) and answer the following questions:

1. What's missing? Is this bar chart usable in its current form?

  ####The bar chart is missing "Title", "X-lables", "Y-lables" and "Axes". This bar chart is not usable in it's current form.

2. What is the role of each of the three nested levels of `g` elements? (keep in mind you'll be adding a title to the chart)

  ####The 1st `g` is a container. It's a coordinate system for a set of SVG elements by applying a transformation to each coordinate specified in this set of SVG elements.
  ####The 2nd `g` is SVG Group Element that groups a set of SVG elements that share the same attribute.
3. Complete the implementation section below. Is there any consequence if you add the `text` elements before or after the `rect` elements? Why?

  ####No. SVG paints the `text` or `rect` before the other with no consequence.
