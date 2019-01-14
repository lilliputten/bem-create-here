# bem-create-here

bem-tools `create` command for executing from current working folder.

Script scans current folders relative to project root, scans for entities
(level, block, mod, elem, elmMod) and runs `bem-tools-create` with specified
command line options and some scanned.

For example suppose project path `...project`, `...project/level` -- for some
level path and `...project/level/block` -- for some block. Then calling:

```shell
...project/level/block$ bem-create-here -m mod -v val -T css
```

-- will be equivalent to next command:

```shell
...project$ bem create -l level -b block -m mod -v val -T css
```

For options see [bem-tools-create](https://registry.npmjs.org/bem-tools-create).
