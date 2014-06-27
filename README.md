jasmine-focus
=============

A "plugin" for [Jasmine 2.0](http://jasmine.github.io/2.0/introduction.html) to facilitate focusing on specific suites/specs a la
RSpec tagging.

## Installation

1. Add the 'jasmine-focus.js' script *after* jasmine.js script and before you
include the boot.js file:

```
  <script type="text/javascript" src="lib/jasmine-2.0.0/jasmine.js"></script>
  <script type="text/javascript" src="lib/jasmine-2.0.0/jasmine-html.js"></script>
  <script type="text/javascript" src="../jasmine-focus.js"></script>
  <script type="text/javascript" src="lib/jasmine-2.0.0/boot.js"></script>
```

2. Modify boot.js to call `jasmineRequire.enableFocusTagging()` (see /example/lib/jasmine-2.0.0/boot.js)

3. Replace the `env.execute()` with `env.executeFiltered()` in boot.js (see /example/lib/jasmine-2.0.0/boot.js)

## Usage

Suites and specs can be tagged in one of two ways:

1. By using the `fdescribe` and `fit` methods instead of regular `describe` and
   `fit`
2. By adding a { focus: true } object as second argument to regular `describe`
   or `it` function calls.

```
  describe("when song has been paused", function() {
    beforeEach(function() {
      player.play(song);
      player.pause();
    });

    // this spec will be executed
    it("should be possible to resume", { focus: true }, function() {
      player.resume();
      expect(player.isPlaying).toBeTruthy();
    });

    // this spec will not be executed
    it("should indicate that the song is currently paused", function() {
      expect(player.isPlaying).toBeFalsy();
    });
  });

  // this spec will also be executed, due to fit() being used
  fit("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  // this entire describe suite will be executed
  describe("#resume", { focus: true }, function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrowError("song is already playing");
    });
  });
```

## Example Application

Open /example/SpecRunner.html in a web browser to see an example based on the
Jasmine 2.0 standalone distribution.

## Similar Work

* [jasmine-focused](https://github.com/atom/jasmine-focused)
  This is a node-module-specific implementation of Jasmine focused execution.

## Acknowledgements

The guts of this library were taken more or less directly from the
[Karma](https://github.com/karma-runner/karma) project.
