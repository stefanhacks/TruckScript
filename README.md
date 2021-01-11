# TruckScript

### A basic, semi-pure, typescript [Capitalist Adventure](http://en.gameslol.net/adventure-capitalist-1086.html) clone, dev'd as a challenge and to get a better native hold of the language, keeping beneath 16hr mark.

-----

#### Status
🚛🚧 In progress.

#### Layers
- ✔ Save/Load
- ✔ Job Structure
- ✔ Job Cycle
- ❌ Basic GUI / Buttons
- ❌ Manager Unlocks
- ❌ Show Time
- ❌ Extra: Cheat Detection

#### Features
- ❌ Buy and upgrade businesses.
- ✔ Delayed make money from a business.
- ✔ Managers, businessess are ran automatically.
- ✔ Save/Load progress + keep track of time passed.


-----

#### TechStack
- 📦 [Parcel](https://parceljs.org), for hosting and packing the project.
- 💻 [Typescript](https://www.typescriptlang.org), as basic language.
- 💎 [Eslint](eslint.org)/[Tslint](https://github.com/typescript-eslint/typescript-eslint) + [Prettier](https://prettier.io), to keep things orderly.
- 🦸‍♀️ [GreenSock](https://greensock.com), for animations.
- 🐺 [Husky](https://typicode.github.io/husky/#/), to enforce Eslint on hooks.

#### How to: Dev
- Get the free [GreenSock](greensock.com/) tarball and leave the bonus tgz (gsap-bonus.tgz) in the main dir.
- `npm install` to install all dev dependencies.

#### How to: Run
- `npm install --global parcel-bundler` to install Parcel Bundler.
- `parcel index.html` to run the project. It should be accessible on localhost:1234.
