# [TruckManager](https://stefantrucks.netlify.app)

### A basic, semi-pure, typescript [Capitalist Adventure](http://en.gameslol.net/adventure-capitalist-1086.html) clone, dev'd as a challenge and to get a better native hold of the language, keeping beneath 16hr mark.

-----

#### Status
🚛 [Live](https://stefantrucks.netlify.app)

#### Features
- ✔ Buy and upgrade businesses.
- ✔ Delayed make money from a business.
- ✔ Managers, businessess are ran automatically.
- ✔ Save/Load progress + keep track of time passed.

-----

#### TechStack
- 📦 [Parcel](https://parceljs.org), for local dev and to pack the project.
- 💻 [Typescript](https://www.typescriptlang.org), as basic language.
- 💎 [Eslint](eslint.org)/[Tslint](https://github.com/typescript-eslint/typescript-eslint) + [Prettier](https://prettier.io), to keep things orderly.
- 🐺 [Husky](https://typicode.github.io/husky/#/), to enforce Eslint on git hooks.
- 🚇 [Netlify](app.netlify.com), as CI.
- 📊 [Trello](https://trello.com/b/a8TEZiV7/tscript), for planning and time tracking. There are better trackers, but I wanted to make the data public, so...

-----

## Whys:
I've been coding for a while now but JS/TS are not exactly something I've specialized in - specially in their brute form. Working with game dev makes you trust in game engines too much and all of that. 

So, to both flex the basics and adventure into making code readable and well structured, I decided to write this clone in TS on it's base form - no Pixi, no Phaser, no Cocos, no nothing. Canvas manipulation at its finest.

As a bonus, working with CI, setting up a local environment correctly - with githooks and elsint - is always good practice.

## Approach:

The intent here was to cover most, if not all bases. No external library was used for time management, mouse events, data control or anything of the sort. My goal was to tackle different typescript problems with little else, as to better move within its confines.

My best efforts were spent in keeping things as single-purpose as possible. Game.ts boots the game, Loader.ts loads the visual assets, and so on. If a function needs debugging, it should lie in the most obvious of places. JSDocs were standart throughout the application, keeping the simple TS pattern, and hopefully clear enough that every method warrants no extra explanation.

Of course, setbacks always happen and such a broad approach does not necessarily render the most pleasant of visual results. Keeping with simple JS constructs allows for little visual power and a lack of glimmer ends up being noticeable. Had I opted to use a robust visual library (React, Pixi, etc) certainly the game would have looked differently - but I believe I would have missed the mark I intended to - the basics.


## Yays:
Since I decided to write stuff - mostly - by scratch, I ran into a few hurdles here and there but I'm satisfied of the result.

#### Setup + Structure
Honestly this was the one thing I was most afraid of. NPM builds, webpacking, hosting, CI are things I always use but rarely set them up. Taking notes and doing things my way made way for great lessons and it paid of. Netlify was easy to set up and get running in no time, and although I struggled a bit with parcel building cycle in the beginning it was only a matter of getting used to it.

#### Canvas manipulation:
Simple, if not exhausting. Drawing frame by frame reminds me of pure Java lessons, no wonder Game Engines are all around us. But once you get the grip and have the basic structure in, it becomes simple to get it going. I'm happy I managed to slide in mobile resizing support, even.

#### Data manipulation: 
Localstorage is quite easily accessible and manageable by JS so no great adventure to be told here. It can get confusing, certainly, if you don't do your usual cleanup afterwards when testing, but it's another one of those things you get used to.

#### Mouse mapping: 
It was way simpler than I thought it would have to be in order to map clicks with the canvas and a custom tracker.

#### Husky:
If you're not using this yet. Do it. I'm probably never gonna quit hooking.

## Nays:

#### Time manipulation:
It's... well, my implementation works as intented, getting time from cycles and saving local time, but I did want to check a server for some kind of cheat detection. Although I've worked with async requests a lot, most free API's I've found were finnicky in some way or another or not always up. Since I had a clock to account for, I ended up ditching these efforts.

#### GUI: 
Drawing GUI from scratch on canvas is... long. Since my knowledge of this was limited, it did not leave much time for other things. At least a third of development was spent here. It made for good exercise, but... again... def. looking up better alternatives.

#### Animations:
I did want to add some kind of animations to the sprites, but the GUI was a time drain and I had to be realistic about things. Although I planned to learn more and use GreenSock, that was not possible in the time period I had. Sorry buddy.

-----

#### How to: Contribute
- `npm install` to install all dev dependencies.

#### How to: Run
- Be sure to have parcel-bundler installed.
- `npm run-script dev` or `parcel index.html` to run the project. It should be accessible on localhost:1234.

#### How to: Build
- Be sure to have parcel-bundler installed.
- `npm run-script build` to build the project. Check the dist folder.

-----

#### License
[MIT](https://choosealicense.com/licenses/mit/)
