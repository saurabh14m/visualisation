Noel Namai 50853403 noelnamai@fas.harvard.edu

# CS 171 Homework 0

**Due Thursday January 30th 2014 11:59 pm.**

Welcome to CS171.  In this class, we will be using a variety of tools that will require some initial configuration. To ensure everything goes smoothly moving forward, we will setup the majority of those tools in this homework.  This homework will not be graded, however it is essential that you complete it timely since the steps in this homework are necessary to begin with HW 1.

## Problem 1 - Class Survey, Signups, and Introduction

### Sign up to github

You'll be using git and [GitHub](http://github.com) to manage homeworks and projects. 

Sign up for a github account (if you don't already have one) and request a free account upgrade [on this page](https://github.com/edu). You'll need to verify ownership of an **.edu e-mail address** (Harvard, MIT or any other) if you didn't sign up with your .edu account. You can use this suggested text to request the account upgrade:

>I will be using my educational micro account for CS 171 - visualization at Harvard (http://cs171.org). We will use github and github pages for the code in our homeworks and for our final projects. Thank you!

This educational micro-plan will enable you to create 5 private repositories. We will need all 5 in the course of the class. If you are already using private repositories at github under your micro plan for other projects, and you can, under no circumstance, free-up your quota, please contact the staff well in advance of the deadline. 

**It is important that you complete this step quickly, as it may take a while for github to provide you with the repositories. Make sure to request a .edu e-mail address if you don't already have one (e.g., because your registered via DCE).**

### Class Survey
Please complete the [mandatory course survey located here](https://docs.google.com/spreadsheet/viewform?formkey=dDJrMGpiNWMtM2NEdHI4YUdsalJnU3c6MA). It should only take a few moments of your time. It will ask you for your **github user name**, so you must go trough the sign-up process first. It is imperative that you fill out the survey on time.

### Piazza
Go to [Piazza](https://piazza.com/harvard/cs171) and sign up for the class using your Harvard e-mail address. If you don't (yet) have a Harvard e-mail address, send an e-mail to [staff@cs171.org](mailto:staff@cs171.org) with the subject "Piazza Access: your@e.mail".  

We will use Piazza as a forum for discussion, to find team members, to arrange appointments, and to ask questions. Piazza should be your primary form of communication with the staff. Use the staff e-mail only for individual requests, e.g., to excuse yourself from a mandatory guest lecture. All readings, homeworks, and project descriptions will be posted on Piazza first. 

### Introduction

Once you are signed up to the Piazza course forum, introduce yourself to your classmates and course staff, as a follow-up [to the introduction thread](https://piazza.com/class/ho6118hjjnr6u6?cid=7). Include your name/nickname, your affiliation, why you are taking this course, and tell us something interesting about yourself (e.g., an unusual hobby, past travels, or a cool project you did, etc.). Also tell us whether you have experience with visualization. 

## Problem 2 - Introduction to Git

We will be using git for version control and collaboration, and github as a host for our git repositories. Linux and (recent) Macs have git command line clients pre-installed. On Windows you can [go here to download and install it](http://git-scm.com/download).

Alternatively, you can use one of the git clients listed on the [resource page](http://www.cs171.org/#!resources.md#Git_Clients).

Read and follow along the mandatory reading - [Understanding Git Conceptually](http://www.sbf5.com/~cduan/technical/git/git-5.shtml). You should use the command line interface to understand what's going on. Then, create your own repository on github with the following name:

```
cs171-hw0-lastname-firstname
```
while replacing lastname and firstname with your actual last and first name. **Please use all-lowercase for your repository name**. Clone this repository to your local computer using something like:

```
git clone https://github.com/GITHUBUSERNAME/cs171-hw0-lastname-firstname.git 
```

Create a `README.md` file, put your name, Harvard ID and e-mail address in it. Then, commit and push to github. Now you should be able to see the changed file in the repository on github.

Next, share the repository with the user **[cs171tf](http://github.com/cs171tf)** by giving this user read permission. You will be asked to share all your projects and homeworks with this user account. Starting with HW1, you will also share the repository with your grading TF — you will be informed who that is.

## Problem 3 - Introduction to D3

**Note: you should be able to complete this problem after you have finished the readings for week 2. There is no need to hand anything in — this is for you to ensure that you understood the concepts.**

Read the mandatory readings, and follow along with the examples in the D3 book (chapters 1-4, for week 1, chapters 5-8, for week 2). We recommend that you put the code you are producing into your github repository for HW0. 

Once you're done with the readings, answer the following questions with regard to this code snippet. Assume the variables used are sensibly defined. You can also look at the [live example here](http://bl.ocks.org/alexsb/8565055).

```javascript
svg.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr({
    class : "bar",
    width : function(d) {return d;},
    height: "40",
    y : function(d, i) {return i*50 + 10;},
    x : "10"
   });
```

 * What does this snippet do?
 * What is `.bar`? What am I selecting?
 * Given that data is an array with `[150, 230, 180, 90]`, what values do `d` and `i` take while this program executes. Why?
 * What does `append("rect")` do?

Now consider the following code:

```javascript
var bars = svg.selectAll(".bar");

var bars_enter = bars.data(data).enter();

var rects = bars_enter.append("rect")
  .attr({
    class : "bar",
    width : function(d) {return d;},
    height: "40",
    y : function(d, i) {return i*50 + 10;},
    x : "10"
   });
```

 * What does this snippet do? How is it different than the previous one?
 * What do the variables `bars`, `bars_enter` and `rects` contain?

