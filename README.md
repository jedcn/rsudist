# rsudist

## Overview

This is the home of some JavaScript that provides a [Custom Function]
for [Google Sheets] named `RSUDIST`.

To use `=RSUDIST()` you provide information about an equity grant:

* How many RSUs were granted?
* When do these RSUs begin to vest?

And with this info `=RSUDIST` will generate a distribution schedule
indicating future distribution (vesting) events.

## Why use `RSUDIST`?

Generally speaking, it can *only help* to better understand any equity
that is due to you.

Specifically, Google Sheets can be a good mechanism for exploring how
changes to a stock's price will impact you.

I couldn't find a way to export distribution schedule information from
a site like fidelity.com and I am only a novice Google Sheets
user. However, `RSUDIST` made reasoning about equity easier and more
accessible.

Whether you use `RSUDIST` or not, I suggest you do some form of
planning in this regard.

## Why share `RSUDIST`?

I have had several conversations around equity with people and wished
for something that is illustrative in the way that `RSUDIST` can be
inside of a Google Sheet.

I have known people that have disregarded compensation via equity
because they did not understand it, and I do not want anyone to make
that mistake if I can help it.

It was helpful to me, and I hope it can be helpful to you.

## Assumptions

* `RSUDIST` assumes a quarterly vesting schedule over 4 years.
* `RSUDIST` (presently) does not model a year long cliff in any grant.

**Warning:** `RSUDIST` was created quickly during a vacation, and I'm
not convinced that it produces accurate results.

It could be valuable to you if you want to get a rough idea of how an
equity situation will change over time inside of a Google Sheet, but
you MUST double check what it produces against the reality defined by
your financial institution.

In this regard, please pay particular attention to the part of the
[LICENSE] that reads:

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED

That said-- I think `RSUDIST` can be useful and I'd ask that you
please [create an issue] if you see a problem.

[Google Sheets]: https://www.google.com/sheets/about/
[Custom Function]: https://developers.google.com/apps-script/guides/sheets/functions
[LICENSE]: ./LICENSE
[create an issue]: https://github.com/jedcn/rsudist/issues/new
