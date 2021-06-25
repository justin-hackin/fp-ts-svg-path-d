# fp-ts-svg-path-d

A functional programming interface to the SVG `<path>` d-attribute (path data) syntax using `fp-ts`.

Although this library can parse all valid path data using `svgpath` package under the hood, it does NOT support the editing and output of:
- relative commands (lower case letter codes)
- V and H commands

The rationale behind using this subset: trigonometric functions can be used to obtain absolute coordinates relative to any other coordinate systems. Current position after V/H commands or relative commands depend on the previous command, which could depend on the previous command (recursively) making iterating over and modifying paths cumbersome. Using this subset, it's easier to plot a new command relative to the previous endpoint and/or tangent.

**WARNING**: This is a work in progress and is not a published library. The author of this work is only just learning fp-ts and sometimes from others who are also just learning. This library is not for use in production code.
