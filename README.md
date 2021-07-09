# fp-ts-svg-path-d

A functional programming interface to the SVG `<path>` d-attribute (path data) syntax using `fp-ts`.

Although this library can parse all valid path data using `svgpath` package under the hood, it limits manipulation and output to an effectively equivalent subset of the svg path commands. This means any path that one can make with the full set of commands can be made with this subset but that some shorthand syntax is excluded.  This subset does NOT support the editing and output of:
- relative commands (lower case letter codes)
- V and H commands
- symmetric bezier commands
  
 These  shorthand forms are extraneous when one is using functions and 2D point abstractions to construct an SVG path. Trigonometric functions can be used to obtain coordinates relative to any coordinate system (defined by 2D transform) whereas relative commands are always only relative to the global coordinate system. 

A path's endpoint after V/H commands or relative commands depend on the previous command, which could depend on the previous command (all the way to the start of the path) making iterating over and modifying paths' coordinates cumbersome. Using this subset, it's also easier to plot a new command relative to the previous endpoint and/or tangent. 

**WARNING**: This is a work in progress and is not a published library. It is not intended for use in production code.
