---
title: G.U.T.S. - The future of SMASH! ticketing.
author: Vadim Brodsky
description: "SMASH!, the largest anime convention in Australia, with over 22,000 people coming annually. And to support this convention we have a range of systems: website, recruitment, and ticketing. And now, in 2019, we have to rewrite the ticketing system from scratch.\_As a bit of backstory, let me tell you how we ended up in this situation."
image:
  src: images/GUTS.png
  alt: GUTS
pubDate: 2019-08-01T00:00:00.000Z
published: true
categories: [Software Engineering]
tags: ['SMASH!', 'typescript', 'react', 'expressJs', 'mysql', 'sass', 'knex']
---

SMASH!, the largest anime convention in Australia, with over 22,000 people coming annually. And to support this convention we have a range of systems: website, recruitment, and ticketing. And now, in 2019, we have to rewrite the ticketing system from scratch. As a bit of backstory, let me tell you how we ended up in this situation.

### The backstory of SMASH! ticketing systems

SMASH! is purely volunteer run, and because of that, it simply lacks the necessary funding to pay for expensive systems like Ticketek or Eventbrite. However SMASH! is run on passion, passion of people from all sorts of backgrounds. And who would have thought that the majority a lot of people who want to dedicate their free time to help grow such convention are IT professionals working in the field. And what do IT guys and girls like doing more than hacking systems? - that's right, building new systems! So at some point, the IT team of SMASH! built it own ticketing system (frontend and backend), and payment link system, and pass issuing system, and local redemption system and infrastructure. One might ask why build so many systems? The answer is always simple: cause there was a need for it.

With 5 systems, maintaining them became quite the challenge, and all of 2018 was spent to just support the existing systems and add 2 minor features. However it became clear that something needed to change when the 2 tech leads, who built the ticketing system and payment link system, retired from SMASH! after 8 years of service, each.

So even before SMASH! 2018 weekend happened, Yaakov and I started taking about the future of SMASH! ticketing.

### The decision

We had 4 options and we had to make a choice...

---

1. Stick with the current system
2. Find an open source ticketing system, and try to make it fit our needs
3. Pay for Ticketek, Eventbrite, or equivalent
4. Build one ourselves

So the biggest problem of #1 is that the old systems were written in a number of languages and used a number of outdated frameworks:

- Ticket-api: ruby on rails, PostgreSQL
- Ticket-frontend: ruby on rails, HAML, Bootstrap, plain CSS
- Payment-link: ruby on rails, PostgreSQL, JadeHTML, Bootstrap, SASS
- PMS (pass management): ruby on rails, PostgreSQL, HAML, Bootstrap, plain CSS
- WEB STIC (local redemption): QT, go, PostgreSQL, Angular 2.0, SASS

And no proper CI / CD implementation (manual testing and deploys were not fun). So if we were to support all this, we would all need to know all of these frameworks and languages. Unfortunately we didn't. Not a single dev that remained on the team knew Ruby on rails, or wanted to spend time refactoring everything to use latest SASS syntax, better performing Postgres queries and fixing the under 50% test coverage that the old systems had. So we chose not to go with option 1.

Option 2 was considered very briefly, as after some research it was shown that there aren't that many _good_ open source ticketing solutions out there. Especially those that would meet our need and would be easy to adapt. Option 2 - rejected.

That left us with option 3 and 4. So after some math and estimating, Yaakov and I figured that building our own system from scratch would be quite feasible, so we sketched up a proposal. During the IT team debrief we presented this to the rest of the team, had a few debates of the structure and the feature set, but agreed that it was worth doing. The last hurdle was to get the executives to approve this endeavour. At the management debrief, I presented this as the main topic of discussion, saying that if we don't do this, we will either lose a lot of money, or never get another new feature in those legacy systems again. Execs agreed to give me and my team a shot, they trusted us, but asked that we give them a solid answer of whether the system can be delivered before the tickets launch, and that date was: 10th of Feb.

### Lets build GUTS!

One of the most important decisions of the IT debrief of 2018 was to find a name for this new proposed ticketing system. Many names were thrown around, some better than others. We had names like: _Bliss, Sybil, Avocado, Hulk, Mordor, Serenity, Tsu, Nigel, Yato, Oni,_ and just plain old _Ticketing_. In IT we love our acronyms, so its only natural that our new name ended up being an acronym.

- **G** - Grand
- **U** - Unified
- **T** - Ticketing
- **S** - System

And thus the Grand Unified Ticketing System (GUTS) was born.

Now to actually build it. At this point all we had was a feature list and a skeleton of an ERD of the database. We needed to agree on a language and framework set that would support such a system. I sought help from a few friends in the industry, one from AWS and one from Beemit. They both recommended pretty much the same tech stack, and after some research I tweaked it a bit to work better with SMASH!s requirements.

The tech stack we ended up with is:

- **Bitbucket** for version control
- Bitbucket pipelines for CI and CD
- **Azure** for hosting (as we get it for free as a Non For Profit (NFP) organisation)
- **Kubernetes**, **Terraform** and **Docker** for all the hosting deployment scaling and automation
- **MySQL** as the database (as we already have a Wordpress site, so we work with MySQL already)
- **Nodejs**, **Express** for the backend and routing
- **knex** and **objection** for database access for the backend
- **Typescript** for the backend and frontend
- **React** for the frontend
- **Redux** for state management
- **Bugsnag** for bug reporting for both client and server
- **SASS** as well as out new [SMASH! component library SKit](https://skit.smash.org.au) for the styling
- And finally **Jest** for testing both the frontend and backend

Yaakov handled the CI/CD and the Azure hosting stuff, while Clement, Brian, MZ, Tony D, Tony L, Patric, Trent, Jenny and I got to work of actually building GUTS.

#### Phase 1

We had a number of revisions of our initial designs, and a number of scope creeps and new feature requests along the way, but we were making good progress towards launching on time. By the 10th of February we had 95% of the user facing UI and logic done, and about 60% of the admin side done. I had to make the call of whether we are launching with GUTS, or falling back to the old systems. I took a risk, and said we would launch GUTS on time. It was rough, a lot of late nights and plenty of testing. A week before launch we tested GUTS with real data and guess what... IT WORKED! I successfully bought a ticket to SMASH! using the new system!

We all rejoiced, we were ready for launch. On the 31st of March 2019 we launched ticket sales, and had around 500 people buy tickets in the first 3 days (due to our early bird discount). Everything worked. No bugs. No site crashing due to traffic. It all worked\*.

Well everything that we launched worked, but we had to cut a few features. Notably PDF ticket generation, seat allocation, and admin order editing. We had to make some sacrifices in order to get something out the door. One thing we didn't sacrifice is unit tests.

#### Phase 2

A month after main tickets launched, we had launch part 2 coming up: Anisong tickets. For this we needed to provide customers with a way to upgrade their tickets if they purchased a SMASH! convention ticket, to a SMASH! + Anisong bundle. Tony D and MZ are the real MVPs here. They got the ticket update feature done in 4 days. Albeit with a few bugs, and barely and tests. But it worked when it needed to.

#### Phase 3

Remember those features we missed out on in phase 1? Well we need to deliver them now. Let's get to it! PDF generation was smashed by Jenny and I; seat allocation was conjured by MZ; a bunch of admin enhancements done by the rest of the team. And then we got another feature request: Kiosk mode. Thankfully Pat managed to write that up on time, even delivering slightly early.

#### Phase 4 and the final stretch

SMASH! is right around the corner and we have 2 more features to build: free pass generation, and barcode generation for printers. Clemmy did the first, while Brian did the second. And here we are, 1 week before SMASH! almost ready for launch. We have our brand new Android mobile scanners all ready to go, all of our attendees have received tickets with QR codes. Oh... wait... we haven't  build the QR code scanning and redemption logic...

With a week to go MZ got right on the backend and I hammered out the front-end of scanning and redemption. And on Friday before convention, when exhibitors were redeeming their passes, thats when I finished it. We tested in production, and it worked?! Once again we were absolutely thrilled that it all came together. However the main challenge was still ahead of us. Saturday... 10,000 attendees... server load... scanner battery life... long queues and wait times... All of these issues were still to be faced. And the worst part is, Yaakov couldn't be there on Saturday. So if ANYTHING went wrong with the servers, rebooting would've been the only thing we could've done really.

### Conclusion

I woke up on Saturday terrified of everything that could go wrong today. I got to ICC, I went to help setup. We all looked ready, but we didn't feel ready. 8am, about a thousand people line up. Usually it takes us till about 12pm to clear the never-ending queue of people, but this year - we were done in 40 mins. When we asked where the rest of the queue was, they replied: thats it, thats all of it. Of course we had more people arrive at around 10-11, but nowhere as bad as previous years. GUTS worked, the mobile scanners worked, everything was solid and fast.

And now we have a fully functional ticketing system with over 5000 users and overall 11,000 tickets purchased. The biggest praise goes to the IT team and their dedication to make GUTS happen, SMASH! 2019 wouldn't have been the great success that it was, if it weren't for our efforts. But now, let's look at the future, with a fully functional and modern system, we can support so many more features, improve the purchase flow, improve the upgrade flow, add nice-to-haves like Apple Wallet integration, order details, and much much more. GUTS will have a bright future ahead of it, but only if it is constantly maintained and improved. We can not just sit on our backs and watch technology move forward while leaving our frameworks and open source modules behind, we need to keep on updating, keep on improving, only then will we be able to support GUTS for the next 5-10 years.
