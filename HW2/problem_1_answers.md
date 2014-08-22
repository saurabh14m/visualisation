For each of the 5 visualizations listed above plus the calendar map, answer the following questions:

Who is the audience? (e.g. project manager, contributor, project user, visitor, etc.)

1. Contributors to a repository = Project manager.
2. Commits Activity = project manager, contributor.
3. Code Frequency = project user.
4. Punch card = Project manager.
5. Pulse = project user, visitor.
6. Calendar map = project user, visitor.

What data have been used? How can you get the data using the GitHub API? (Note that it can be the combination of multiple queries and their processing).

1. Contributors to a repository = GET/search/users.
2. Commits Activity = GET/repos/:owner/:repo/git/commits.
3. Code Frequency = GET/repos/:owner/:repo/git/commits.
4. Punch card = GET/repos/:owner/:repo/git/commits.
5. Pulse = GET/repos/:owner/:repo/git/commits. Since - until
6. Calendar map = GET/repos/:owner/:repo/git/commits. Since - until

Those visualizations are updated over time. What happens if suddenly a contributor pushes many commits in a short time interval? How would you address this particular issue?

1. Contributors to a repository = commit count by the contributor goes up.
2. Commits Activity = general commit activity goes up.
3. Code Frequency = general commit frequency goes up.
4. Punch card = node for that day enlarges.
5. Pulse = the pulse is updated.
6. Calendar map = the check box for the respective time is updated.


I would request futher review of the commits and only accept the final commits. Likewise, I would update deletions as deletions.Commits with no major updates will be merged with others.

Looking at the network graph, answer the same questions as above, plus:

a. Who is the audience?: project user, visitor.
b. What data have been used?: GET/search/users Since - until

What is the role of interaction for this visualization? Would a static graph have been sufficient?

With interaction, one can easily view or have a feel of relevant information or data quickly and easily. A static graph would not have been sufficient.

What happens if many new developers suddenly join the project and push commits for the first time? How would you to preserve the graph's readability in such a situation?

I would rank the users by stars and only use relevant commits.
