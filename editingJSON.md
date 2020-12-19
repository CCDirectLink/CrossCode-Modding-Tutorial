# Editing JSON

Often it is not enough to just edit png files to make mods. Changing sizes, making new entities or maps require one to edit or create new JSON files. This guide shows you how to work with JSON files in your mod.

## Requirements

* [Making a mod](./makingAMod.md)

## New JSON files

Adding new JSON files does not require any special attention. Simply put the file into the correct folder and CCLoader will pick it up automatically.

## Existing JSON files

Editing existing JSON files is problematic in a few cases. Now only are these files pretty big but there are also a lot of instances where multiple mods want to modify the same file. In that case simply replacing the entire file doesn't work.

Instead you can use a mechanism called patches. These are files that only record the changes made to the original file, allowing multiple mods to apply patches to the same file. They work similar to file replacements as they require you to use the same name as the original file. The difference is that they append a `.patch` to the filename and use special sytanx exmplained in more detail on [this wiki page](https://wiki.c2dl.info/Patching).

In order to work with JSON files it is recommend to beautify them before using them. You can use [beautifier.io](https://beautifier.io/) to do that for you.

In this example we will make a patch that will increase the damage Lea does. This information can be found in `assets/data/players/lea.json`. Once beautified one can easily see the value we want to modify.

```json
{
    "character": "main.lea",
    "sheet": "player",
    "headIdx": 0,
    "class": "SPHEROMANCER",
    "stats": {
        "hp": {
            "base": 200,
            "increase": 2000,
            "variance": 0.1
        },
        "attack": {
            "base": 20,
            "increase": 200,
            "variance": 0.9
        },
        ...
```

Now we want to somehow change `stats.attack.base` to `200`. For that we first create a patch file `assets/mods/myMod/assets/data/players/lea.json.patch`

| :rocket: Tip: Most editors will not recognize these files as JSON by default. Almost all popular editors include a feature to manually set which type of file you are currently editing.|
|---|

First you can begin the file with `[]` to signal that this file is using the "Patch Step" format:
```json
[

]
```

Next we insert a step that navigates into the `attack` object:

```json
{
    "type": "ENTER",
    "index": ["stats", "attack"]
}
```

Now we can overwride a value:

```json
{
    "type": "SET_KEY",
    "index": "base",
    "content": 200
}
```

At the end, we navigate back to the root of the document. In this case it is not required but will make future additions a lot easier.

```json
{
    "type": "EXIT",
    "count": 2
}
```

At the end we end up with this `lea.json.patch` file:
```json
[{
    "type": "ENTER",
    "index": ["stats", "attack"]
}, {
    "type": "SET_KEY",
    "index": "base",
    "content": 200
}, {
    "type": "EXIT",
    "count": 2
}]
```