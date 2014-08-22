### Questions
1. The `domain()` function is the data range upon which the scale is calculated. What does `d3.selectAll("tbody tr")[0].length-1` mean?

  ####It selects an array from `"tbody" > "tr"` and returns the array lenght-1.

2. Add the snippet in your code. Describe, in words, what the following function calls return: `color(0)`, `color(10)` and `color(150)`?
 
  ####They return the color from the `var color` of the index supplied.

3. If the array passed to `domain()` was the minimum and maximum rate values, how would that change the scale? In what situations would this be appropriate?

  ####The scale will range from 2.9 to 9.0. It will be appropriate if we were to view how the rate values vary by state.
