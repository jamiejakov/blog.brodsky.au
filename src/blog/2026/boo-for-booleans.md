---
title: Boo for Booleans
author: Vadim Brodsky
description: 'Booleans are not ideal, they should probably be something else'
image:
  src: images/booleans.jpg
  alt: Matrix red pill or blue pill boolean choice
pubDate: 2026-03-24
published: true
categories: ['Software Engineering']
tags: ['best practices']
---

Booleans are the core of all software: the combinations of `true` and `false` or `1` and `0` is what powers all modern computing.
But in Software Engineering, the more higher level kind, booleans are seldom the tool that us programmers should be reaching for.

As my mentor and Distinguished Engineer of Canva **Dave Hearnden** so eloquently put it:

> Booleans are bad, nobody likes booleans,
>
> booleans have no friends, boo for booleans.

But why is that? Why should booleans be avoided? And what should we be using instead?

---

## Inspiration

What inspired this post is my favorite phrase from Dave, that has become my go-to during PR reviews at work, and also [the video from _Theo t3.gg_](https://www.youtube.com/watch?v=xIRL3klHM9I) on this exact topic.
Theo's video was based of an article by Nicole Tietz-Sokolskaya titled ["That boolean should probably be something else"](https://ntietz.com/blog/that-boolean-should-probably-be-something-else/), where she said:

> Booleans are sneaky. They feel like they make sense for our data, but they make sense for our **logic**. The data is usually something different underneath. By storing a boolean as our data, we're coupling that data tightly to our application logic.

I highly recommend you read Nicole's article and watch Theo's video, and also read what I have to say about booleans:

## Intro

Using a boolean is practically always a sign of lack of an understanding of the existing system, and a lack of foresight into how that system may evolve.
It is the easy option - "this thing should not look like this under condition X, ok lets make a boolean `isX` and pass that around".
This "simple" solution will technically work, but it will not allow the system to grow, scale, and for new features to be built around it easily.

Lets look at the reasons why booleans don't work for us as well as some may think they do, and I'll outline alternatives as well.

## Booleans aren't really boolean

It is very rare to have code that is truly boolean in nature. Most code doesn't neatly fit into an `on` or `off` state.
It tends to grow beyond that dual state very quickly into:

- `on`
- `on-for-some-users`
- `off-for-everyone-actually`
- `off-but-not-for-admins`
- etc...

While a lot of concepts start off boolean, they quickly evolve to not be a set of 2. And preparing for that inevitable change,
will set your codebase up for the long term much better.

## Booleans are trileans

Have you ever found yourself wanting to add a boolean to an already existing react props, or function?
But you don't want to go through an update every consumer of it, so you add it like this:

```ts
type Props = {
  // some other props
  canDoFoo?: boolean;
};
```

This is no longer a boolean, this is trilean. It has 3 states: `true`, `false`, `undefined` which all could mean different things.
One might argue that undefined and false mean the same thing. But how am I supposed to know that from just reading the type?
I'd have to read the code to figure out how it is used before I would be convinced that they are the same.
And if they are the same, why have both? convenience? just update the other callers around the codebase...

And in cases when false and undefined actually mean different things, then it is even more confusing. What does an undefined boolean mean??

## Boolean names are confusing at best

If you see this in the codebase:

```ts
const open = ...
```

What do you think the type of `open` is? Is it a function which you can call like this: `open()` or is it a boolean?
In Typescript doing this:

```ts
if (open) {
  // do something
}
```

is valid for both cases! So I have seen many bugs in the codebase where people assume a variable is a boolean due to its naming, but in reality it is not.

The solution, you may has is to name the boolean better, with an `is*` prefix: `isOpen` - then this is obviously a boolean!
Yes you could, but then it becomes confusing as sometimes you will see `is*` and othertimes you will see `are*` or `has*` or `will*` or `can*`.
Still better than not having them, but not as good as not using a boolean.

## Boolean names are arbitrary

When naming a boolean, how do you chose which way to name it? What I mean by that, imagine you had a flag to turn a feature Foo on or off.
Which name would you pick

1. `enableFoo: boolean`
2. `disableFoo: boolean`
3. `isFooOn: boolean`
4. `isFooOff: boolean`
5. `isFooEnabled: boolean`
6. `isFooDisabled: boolean`

I hope we can all agree that options 4 and 6 are the worst, because there is nothing more confusing that reading a double negative: `!(!isFooOff && isBarDisabled)`

I have seen many cases of `const isDesktop: boolean` and `const isMobile: boolean`, and my question to those every time is: why did you pick desktop for the name and not mobile?.
With booleans like these it is never clear which is the "negative" cause there isn't one... they are both positive, they are just different states. And neither state should be taking priority over the other.

## Boolean code is hard to parse

Up until the advent of AI coding tools, code was meant to be read by other humans. So making it easy to read was essential.
Would you rather deal with figuring out:

```ts
if (a && b && (c || !d)) {
  // do something
}
```

or

```ts
if (a != null && b == 'something-meaningful' && (c > 0 || d == null)) {
  // do something
}
```

Sure in the first case if all the variables are very explicitly named, then the final condition can still be parsable.
But in the second case, all the variables are actual pieces of state with meaning, and thus these comparisons describe the logic better.
What I am saying is that

```ts
if (event.endTime < new Date()) {
  // do something
}
```

is more readable than some arbitrary extra meaning that was given to the variable name for no reason:

```ts
const canBuyPancake = event.endTime < new Date();
if (canBuyPancake) {
  // do something
}
```

(I will acknowledge that if the variable was named `isEventOver` that wouldn't be as problematic, but as I mentioned before, that can quickly grow out of hand, especially when the code gets refactored and the logic moves somewhere else)

### Hard to parse in function calls

Have you ever seen something like this: `calculatePayment(false)`. I have, many times, and it has stumped me every time.
What does false mean here? does it mean to not calculate the payment???

The condition that the internals of `calculatePayment` is not apparent to the consumers at all. (Same thing goes for numbers and plain strings btw).
A solution would be to require passing an object `calculatePayment({ includeSurcharge: false })`.
But this once again suffers from the same problem of having to name the boolean, and encoding **logic** into **data**.

## What to use instead

There are 3 alternatives to boolean:

- String unions (or enums) (enums vs string unions is a whole separate topic)
- Numbers or DateTimes
- Null

### String Unions

A lot of booleans are just a combination of multiple states that are mutually exclusive. So instead of defining them as a boolean, define all the possible states.

```ts
// For example
// instead of:
const short: boolean;
// or
const isShort: boolean;
// or
const isLong: boolean;
// ^ good luck on deciding on which one is the right name
//
// set up a string union
const shape: 'short' | 'long';
```

This makes it extremely clear of what the property is: shape, and what data this property can have.
All of this can also be achieved with enums, but in typescript enums are finnicky, so string unions are generally simpler to work with.

### Number or DateTime

Instead of storing a boolean as data to demonstrate state, it is almost always to store a datetime or number to log when this state has changed.
"Is the user's email validated", "Are they logged in", "Is the event active", "Are there items left on sale"
All of these could be encoded with numbers to represent quantity / inventory and DateTimes to represent when an event occurred that caused the state to change.

For example, instead of storing: "hasPaid" in the DB, storing the amount paid, and the amount requested to be paid is a much better approach.
Because it not only allows you to compute the value for the **logic** of "has the user paid", but it also lets you use the actual amount for other things, like generating a receipt, etc.

## Null

Null checks are one of the most powerful options we have, as the presence of data is fully boolean in nature: the data is there or it isn't, there is no inbetween.
If your data structures are set up in a right way, then that means that checking for null will tell you exactly what you need to know, without needing for an extra boolean.

Even with null checks I still see people doing this:

```ts
const hasBooking = order.booking != null;
```

This is very rarely a good idea, because it was already easy to parse the null check, and it is also very transparent that it isn't hiding anything else underneath.
The `hasBooking` field could do that null check, but could evolve to do some extra thing or 2 later, and the code that relies on it might not need that extra logic.
Which generally leads to more refactoring, or introduction of more functions, with more booleans, etc...

## To wrap up

I believe booleans should be avoided as much as possible, and every time I see a boolean I heavily scrutinize it, trying every way I can to remove it.
Good luck coding folks!
