---
title: Rebuild with Eleventy
tags: posts
modified_date: "Last Modified" #does nothing for now. Write date plugin for formatting
---

### Guiding Question

How to continue personal software exploration when the computers seemingly give you what you want.

### Preamble

8 years ago, I started a blog with Lektor. I didn't like it very much (my site, Lektor was fine), and was preoccupied and less driven to follow up on personal software while school/job things occupied thinking capacity.
3 years ago, I tried again, rebuilding a new blog with Eleventy. I liked it a lot more, but was too preoccupied with startup turbulences and the unicorn "cushy tech job" seemingly just a dream.
Now, I am once again in a place to explore my interests; while the tech jobs seem robotic. I'll take this time to try something different before jumping back into the same rough professional waters I've floundered in since 2020.

### Thoughts

Here's to following through. I started building this blog during my last bout of funployment. Most of my work since then seemed locked down in the corporation I was at, and my perceived effort to recreate my work in any meaningful way on the outside was limited so I never got this off the ground. In my latest bout of funployment, I'm trying to find more meaning in personal software work, and the best place to start is at square one again. The blog! If nothing else, maybe I can get the writing process to keep me motivated and continue finding joy in exploration.

### Overview of Framework

Eleventy has been around a long time. It's a static site generator. Like most, it has support for templates, markdown for content and plugins for additional functionality. I chose it because I liked the layout of the documentation and the customizable nature with good defaults for the framework. It seemed easier to rebuild and switch from the other SSG I was using (Lektor), since I don't have tons of hands on recent Python work. As for now, I have layouts for blogs, have picked a super cool minimal theme, and tried to have support for sorting my posts according to date. Check the picture for the simplistic organization I have.
![An annotated folder structure. _data is global metadata. content/ holds all content. content/blog.njk is separate from layouts because its a single page template. content/blog holds blog posts in markdown. layouts/ has reusable nunjucks templates. public/ has built html pages](./Eleventy%20folder%20explained.png)

### Takeaways

Hand coding a blog is still worth it. The AIs definitely can do it faster, and likely better given the right context, but there is no skill development without hands on work. Besides, having a manual starting point, and well understood starting project, only opens the door to the more.

Also, it's more a reframing issue than anything. Offloading thinking to AI sucks, offloading tedium and some small wins is a boost.

### Further Exploration

- Include further sections of the website as necessary and normal stuff like pagination, tags, search
- Research skills for gen AI writing companion or simpler models if appropriate
- Optimize. Attribution, open graph, agent optimized, all the things
- Figure out extended markdown support, and a reasonable way to show the flow of development across posts of any sort
