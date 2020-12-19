# Making a JavaScript mod

Although the game provides a very powerful JSON scripting system it is sometimes required to add new puzzle elements or edit internal workings of existing ones. For this one needs javascript mods.

## Requirements 

* [Making a mod](./makingAMod.md)

## Entry points

In order to load a JavaScript file, there needs to be an entry in the `package.json` of the mod. There are multiple possible values here that reference different points in time at which a mod is loaded. Furthermore there is an entry called `plugin` which combines all these entry points.

For example, if we want to double all gained CP points we need to add a script:
```json
{
    "name": "my-mod",
    "ccmodHumanName": "My Mod",
    "version": "1.0.0",
    "plugin": "plugin.js"
}
```
| :warning: If you use entry points other than `plugin` you should always set `"module": true` as well. |
|---|

## Mod loading stages

### Prestart

This is the entry point you usually want to use. At this point, most of the game code is loaded but almost none of it executed yet. This makes it the perfect chance to change how the internals work.

### Preload

At this point none of the game has been loaded yet. This means that while nothing has loaded yet but one can use this to set up libraries or use some JavaScript black magic.

### Postload

Here some of the game code has been loaded, however pretty much nothing has been executed yet. Specifically, none of the resources have been been loaded yet, making it possible to intercept and work with them.

### Main

This stage, which has been called "main" for legacy reasons, executes code as soon as the title menu start playing. This allows mods to use code that may have not been executed yet in the prestart stage, though it should be avoided is easily possible.


## Plugin

While using loading stages directly in the `package.json` directly executes the code in a script the plugin combines multiple stages at once. Every plugin defines an exported JavaScript class that is used to execute the code.

Since we defined the file as `plugin.js` above we create a new file `assets/mods/myMod/plugin.js`:
```js
export default class MyMod {
    prestart() {
        //Prestart code will go in here.
    }
}
```

The advantage of using plugins over direct stages is that the constructor of the plugin receives an object as argument which can be used to find out which folder the current mod is stored in.

| :rocket: Tip: A plugin can also be used to write async code in a loading stage, blocking all other mods from loading until it has finished. |
|---|

Now that we can execute code in the prestart stage, we need to find out how to double the CP points. If we look into the `assets/js/game.compiled.js` file we can find out that there is a class called `sc.PlayerModel` which contains a function 
```ts
public addSkillPoints(points: number, element: number, all: boolean, extra: boolean): void
```

We now want to manipulate `addSkillPoints` so that `points` are doubled. For that we can use the `inject` function. This is a function that exists on all classes that allows you to add and overwrite existing functions. Furthermore, inside that function you can use `this.parent(...)` to call the original functon.

We can use this to make a mod that doubles all CP:
```js
export default class MyMod {
    prestart() {
        sc.PlayerModel.inject({
            addSkillPoints(points, element, all, extra) {
                this.parent(points*2, element, all, extra);
            }
        });
    }
}
```