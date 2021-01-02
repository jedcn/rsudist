# rsudist

## Overview

This is the home of [some JavaScript][Code.js] that provides a [Custom
Function] for [Google Sheets] named `=RSUDIST`.

`=RSUDIST()` takes information that you provide information about an
equity grant:

* How many RSUs were granted?
* When do these RSUs begin to vest?

And generates a distribution schedule indicating future distribution
(vesting) events within a Google Sheet.

## Why might you use `=RSUDIST`?

`=RSUDIST` makes reasoning about equity easier and more accessible.

You can *only benefit* from better understanding any equity that has
been granted to you.

And Google Sheets is a good mechanism for exploring how vesting equity
and changing stock prices can impact you.

## Why would I share `=RSUDIST`?

I have had several conversations about equity with people and wished
for something that is illustrative of outcomes in the way that
`=RSUDIST` can be inside of a Google Sheet. If you are getting your
first grant it can be somewhat confusing.

Additionally, I have known people that have disregarded compensation
via equity because they did not understand it, and I do not want
anyone to make that mistake if I can help it.

## How do you "get" `=RSUDIST`?

1. Create a new Google Sheet
2. Navigate to Tools > Script Editor (a new window will open)
3. Replace the default Script Editor content of `function myFunction {
   }` with the content of [this file][Code.js].
4. Save your changes in the Script Editor
5. Navigate back to your Google Sheet
6. See below for three ways to verify that `=RSUDIST())`is working as
   expected.

## How to use `=RSUDIST`?

It can be invoked with arguments directly:

`=RSUDIST(16, "1/1/2020")`

<img alt="RSUDIST with values" src="images/rsudist-invocation-by-value.jpg" width="250" />

Alternatively, you could put `16` in a cell side-by-side `1/1/2020`
and you can pass in references to those cells:

`=RSUDIST(A1:B1)`

<img alt="RSUDIST with references" src="images/rsudist-invocation-by-reference.jpg" width="400" />

If you're in the fortunate situation where you have two grants, you
could put a grant in each row (like above) and then pass in references
to those two rows. In this situation, `=RSUDIST` will merge the
results, and if vest dates overlap the RSUs vested will be added
together:

`=RSUDIST(A1:B2)`

<img alt="RSUDIST with two grants" src="images/rsudist-two-grants.jpg" width="400" />

## Assumptions and a Warning

* `=RSUDIST` assumes a quarterly vesting schedule over 4 years.
* `=RSUDIST` (presently) does not model a year long cliff in any grant.

**Warning: `=RSUDIST` was created quickly during a vacation with
limited input, and I'm not convinced that it produces accurate
results.**

It could be valuable to you if you want to get a rough idea of how an
equity situation will change over time inside of a Google Sheet.

However, YOU MUST DOUBLE CHECK what it produces against the reality
defined by your financial institution.

In this regard, please pay particular attention to the part of the
[LICENSE] that reads:

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED

## In Closing

I think `=RSUDIST` can be useful and I'd ask that you please [create an
issue] if you see a problem.

[Code.js]: src/Code.js
[Google Sheets]: https://www.google.com/sheets/about/
[Custom Function]: https://developers.google.com/apps-script/guides/sheets/functions
[LICENSE]: ./LICENSE
[create an issue]: https://github.com/jedcn/rsudist/issues/new
