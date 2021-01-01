# rsudist

## Overview

This is the home of some JavaScript that provides a [Custom Function]
for [Google Sheets] named `RSUDIST`.

To use `=RSUDIST()` you provide information about an equity grant:

* How many RSUs were granted?
* When do these RSUs begin to vest?

And with this `=RSUDIST` will generate a distribution schedule
indicating future distribution (vesting) events.

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
