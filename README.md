[![npm version](https://badge.fury.io/js/bem-create-here.svg)](https://badge.fury.io/js/bem-create-here)

# bem-create-here

bem-tools `create` command for executing from current working folder.

Script scans current folders relative to project root, scans for entities
(level, block, mod, elem, elemMod) and runs `bem-tools-create` with specified
command line options and some scanned.

For example suppose project path `...project`, `...project/level` -- for some
level path and `...project/level/block` -- for some block. Then the following call form:

```shell
...project/level/block$ bem-create-here -m mod -v val -T css
```

...will be equivalent to next command:

```shell
...project$ bem create -l level -b block -m mod -v val -T css
```

For command line options see [bem-tools-create CLI](https://github.com/bem-tools/bem-tools-create#cli).
