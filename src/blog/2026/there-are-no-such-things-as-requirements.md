---
title: There is no such thing as requirements
author: Vadim Brodsky
description: 'Many engineers treat product handoffs as fixed requirements. They are not—and it is our job to refine asks with feasibility in mind, not to hide behind the word when trade-offs get uncomfortable.'
image:
  src: images/requirements.jpg
  alt: Folder tab labelled requirements, evoking specs treated as frozen rather than negotiable
pubDate: 2026-03-28
published: true
categories: ['Software Engineering']
tags: ['best practices', 'product']
---

For many engineers, especially earlier in their careers, the work looks like a straight line: step 1 → 5. Whatever product and design gave you before step 1 might as well be carved in stone; shipping exactly what was written down feels like the real requirement.

The steps themselves are familiar:

1. Break the problem into smaller chunks.
2. Assess how they fit into existing systems and what needs to change.
3. Weigh alternatives.
4. Estimate what it will take to build.
5. Build it!

The trouble is treating that sequence as strictly linear and the initial brief as immutable. I will admit I used to think the same way. I received requirements and tried to build what was asked. If another engineer were to push back on changes I proposed, I’d say: “That is the requirement.” I said it in a review on code one of Canva’s Distinguished Engineers owned and instead of understanding, I got this response:

---

> Oh no, you used the "R" word. 😱
>
> 🛑 There is no such thing as a "requirement"🛑
>
> There are only asks/desires/ideas, and it's engineering's job to refine every proposal through the lens of feasibility, in order to pick the most deliverable option that essentially addresses whatever the underlying need or hypothesis is.

That instantly rewired how I saw the relationship between engineering and product. Engineers are not bots that turn requirements into code; we are custodians of the codebase, we manage it's complexity. Part of the job is to explain constraints early, work with product and design on feasibility, and steer toward experiences users will love without sacrificing quality or extensibility.

Doing that means treating early asks as hypotheses, not marching orders; having the conversation about risks, options, and trade-offs before commitment sets in. You become a co-owner of the experience - you can and should raise concerns and opinions. The strongest engineers I know pair deep technical judgment with product sense; they make trade-offs that leads trust rather than fear.

So I share this whenever someone uses _requirements_ to justify a poor architectural call or a convenient shortcut. I hope it lands the way it landed for me - less automatic deference to the spec, more honest collaboration with product and design.
