Look at the data given in the Wiki table. Describe the data types. What is different from the datasets you've used before?

#### The data is presented in "strings". To be usefull in d3, we'll have to convert all dates to date objects and values to integers.

Take a look at the DOM tree for the Wikipedia table. Formulate in jQuery selector syntax the selection that would give you the DOM element for the second row in the Wikipedia table. Write down in selection syntax how you would get all table rows that are not the header row.

#### $(".wikitable tr:nth-child(2)")

#### $(".wikitable td:not(:first-child)")
