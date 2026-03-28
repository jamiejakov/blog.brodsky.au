---
title: There are no such things as requirements
author: Vadim Brodsky
description: "Engineers treat requirements as if they were set in stone, but in reality they are not, and it's our responsibility to discuss and sometimes challenge them."
image:
  src: images/requirements.jpg
  alt: Matrix red pill or blue pill boolean choice
pubDate: 2026-03-28
published: true
categories: ['Software Engineering']
tags: ['best practices', 'product']
---

Software Engineering as a profession is solving user problems by creating programs. The problems can be clear and the problems can be vague, but regardless, the steps we take are the same:

1. break down the problem into smaller chunks
2. Assess how they fit into existing systems / and what changes need to be made
3. Weigh out alternatives
4. Estimate the time it would take to build
5. Build

The problem that I want to discuss here is that to a lot of engineers, especially less tenured ones, these steps are linear, 1 → 5. They accept that whatever they got from their product and design leads before step 1 is final and cannot be changed, that building exactly what was defined is a requirement.

I will admit I thought the same way! I received requirements and then tried to figure out how to build what they asked. And if another engineer pushed back on the changes I proposed to their code, I’d simply say: “That is the requirement”. Well I did that to some code that one of Canva’s Distinguished Engineers owned, and got this response:

---

> Oh no, you used the "R" word. 😱
>
> 🛑 There is no such thing as a "requirement"🛑
>
> There are only asks/desires/ideas, and it's engineering's job to refine every proposal through the lens of feasibility, in order to pick the most deliverable option that essentially addresses whatever the underlying need or hypothesis is.

That completely broke my understanding of the relationship engineers had with the product leads and the responsibilities we had. This made me realise that engineers are not just bots that convert requirements into code. We are custodians of the code and need to communicate the constraints we have to product and design leads to find paths to build experiences that would be loved by users, while maintaining the quality and extensibility of our codebase.

As software engineers we have a responsibility to have a conversation with the product and design leads about the issues we see with their requirements ideas and together figure out what approaches we can take to mitigate the risks and deliver.

By doing this we become co-owners of the experience and we are allowed to voice our concerns and provide opinions on it. I believe that understanding the product is a key skill for any software engineer. The best engineers I know deeply understand both the technical side and the user experience, and can make good calls and trade offs that don’t scare the product leads.

So this is a lesson I share with all the engineers that attempt to use the word _requirements_ as justification for poor architectural decisions or shortcuts they are making. And I hope this lesson has the same impact it had on me, making me think about things a bit more and ultimately helping me work better and more collaboratively with product and design leads.
