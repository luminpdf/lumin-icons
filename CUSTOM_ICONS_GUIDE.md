# Adding Custom Icons Guide

This guide explains how to add custom icons to your icon library using the `add-custom-icon` script.

## Prerequisites

- SVG files designed on a 256x256 pixel grid
- SVG files should use `currentColor` for fill or have `#000` colors
- Files should only contain `path` elements (flatten your designs)

## Installation

The script uses existing dependencies and doesn't require additional packages. It's ready to use out of the box.

## Usage

### Adding Icons from a Folder

```bash
# Using npm scripts (recommended)
npm run add-icon -- --folder ./my-custom-icons
npm run add-icon -- --folder ~/Downloads/icons

# Preview changes without writing files
npm run add-icon:preview -- --folder ./my-custom-icons
npm run add-icon:preview -- --folder ~/Downloads/icons

# Overwrite existing icons
npm run add-icon -- --folder ./my-custom-icons --overwrite

# Direct script usage
tsx scripts/add-custom-icon.ts --folder ./my-custom-icons
tsx scripts/add-custom-icon.ts --folder ~/Downloads/icons --dry-run
```

### Adding a Single Icon

```bash
# Using npm scripts (recommended)
npm run add-icon -- --icon ./path/to/icon.svg --name my-custom-icon
npm run add-icon -- --icon=./star.svg --name=custom-star

# Preview the change
npm run add-icon:preview -- --icon ./path/to/icon.svg --name my-custom-icon
npm run add-icon:preview -- --icon=./star.svg --name=custom-star

# Direct script usage
tsx scripts/add-custom-icon.ts --icon ./path/to/icon.svg --name my-custom-icon
tsx scripts/add-custom-icon.ts --icon=./star.svg --name=custom-star --dry-run
```

### Command Options

| Option        | Short | Description                                         | Example                                            |
| ------------- | ----- | --------------------------------------------------- | -------------------------------------------------- |
| `--folder`    | `-f`  | Path to folder containing SVG files                 | `--folder ./icons` or `--folder=~/Downloads/icons` |
| `--icon`      | `-i`  | Path to individual SVG file                         | `--icon ./star.svg` or `--icon=./star.svg`         |
| `--name`      | `-n`  | Custom name for the icon (required for single file) | `--name custom-star` or `--name=my-icon`           |
| `--dry-run`   |       | Preview changes without writing files               | `--dry-run`                                        |
| `--overwrite` |       | Overwrite existing icons (use with caution)         | `--overwrite`                                      |
| `--help`      | `-h`  | Show help message                                   | `--help`                                           |

**Important:** When using npm scripts, you must use `--` to pass arguments:

```bash
npm run add-icon -- --folder=~/Downloads/icons  ✓ Correct
npm run add-icon --folder=~/Downloads/icons     ✗ Won't work
```

## File Naming Convention

### Weight Detection

When adding from a folder, the script recognizes these patterns:

- `icon-name.svg` → regular weight
- `icon-name-thin.svg` → thin weight
- `icon-name-light.svg` → light weight
- `icon-name-bold.svg` → bold weight
- `icon-name-fill.svg` → fill weight
- `icon-name-duotone.svg` → duotone weight

### Special Name Transformations

The script automatically handles special naming conventions:

#### Prefix Removal

- `lm-icon-name.svg` → `IconName` (removes `lm-` prefix)

#### Number to Word Conversion

- `lm-3-squares.svg` → `ThreeSquares`
- `lm-1-dot.svg` → `OneDot`
- `2-lines.svg` → `TwoLines`

#### Mixed Alphanumeric

- `3d-cube.svg` → `ThreeDCube`
- `2d-chart.svg` → `TwoDChart`

#### Supported Numbers

The script converts numbers 0-25, 30, 50, 100 to words:

- `0` → `Zero`, `1` → `One`, `2` → `Two`, `3` → `Three`, etc.
- Numbers above 25 remain as numbers unless manually added to the mapping

## Icon Weight Variants

The library supports 6 weight variants:

- **regular** - Default weight
- **thin** - Thinnest stroke
- **light** - Light stroke
- **bold** - Bold stroke
- **fill** - Filled version
- **duotone** - Two-tone version with opacity

### Missing Weights

If you don't provide all weight variants:

- The script will create fallback versions using your provided weight
- A warning will be shown for missing weights
- You can add missing weights later by running the script again

## Examples

### Example 1: Complete Icon Set

```
my-icons/
├── user-profile.svg          # regular weight
├── user-profile-thin.svg     # thin weight
├── user-profile-light.svg    # light weight
├── user-profile-bold.svg     # bold weight
├── user-profile-fill.svg     # fill weight
└── user-profile-duotone.svg  # duotone weight
```

```bash
npm run add-icon -- --folder my-icons
```

### Example 2: Single Icon

```bash
npm run add-icon -- --icon ./custom-star.svg --name star-custom
```

### Example 3: Special Naming Conventions

```
special-icons/
├── lm-3-squares-split-horizontal.svg  # → ThreeSquaresSplitHorizontal
├── lm-2-lines.svg                     # → TwoLines
├── 3d-cube.svg                        # → ThreeDCube
└── lm-1-dot-bold.svg                  # → OneDot (bold weight)
```

```bash
npm run add-icon -- --folder special-icons
```

### Example 4: Partial Icon Set

```
partial-icons/
├── settings-gear.svg      # regular weight
├── settings-gear-bold.svg # bold weight
└── settings-gear-fill.svg # fill weight
```

The script will create missing weights automatically using the available weights as fallbacks.

## SVG Requirements

### Design Guidelines

1. **Grid**: Design on a 256x256 pixel grid
2. **Colors**: Use `currentColor` or `#000` for themeable colors
3. **Elements**: Prefer `path` elements over other shapes
4. **Complexity**: Keep designs clean and simple for scalability

### Automatic Corrections

The script automatically:

- Adjusts viewBox to "0 0 256 256"
- Adds `fill="currentColor"` if missing
- Converts colors to `{color}` in JSX
- Transforms attributes to camelCase (e.g., `stroke-width` → `strokeWidth`)

### Example Valid SVG

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
  <path d="M128 32C74.98 32 32 74.98 32 128s42.98 96 96 96 96-42.98 96-96S181.02 32 128 32z"/>
</svg>
```

## Assets Storage

**Important:** Custom icons are stored separately from the core library:

- **Core icons**: `core/assets/` (from submodule, don't modify)
- **Custom icons**: `src/assets/` (your custom additions)

This separation ensures:

- Your custom icons won't be overwritten by core updates
- Easy to manage and version your custom additions
- Core library stays clean and updateable

## After Adding Icons

1. **Build the library**: The script only adds SVG assets and basic components
2. **Generate final components**: Run `npm run assemble` to regenerate all components
3. **Test imports**: Import and test your new icons
4. **Update documentation**: Add your custom icons to your project docs

## Generated Files

For each icon named `my-icon`, the script creates:

```
src/assets/
├── regular/my-icon.svg
├── thin/my-icon-thin.svg
├── light/my-icon-light.svg
├── bold/my-icon-bold.svg
├── fill/my-icon-fill.svg
└── duotone/my-icon-duotone.svg

src/
├── defs/MyIcon.tsx     # Weight definitions
├── csr/MyIcon.tsx      # Client-side component
└── ssr/MyIcon.tsx      # Server-side component
```

The exports are automatically updated in:

- `src/index.ts` (CSR exports)
- `src/ssr/index.ts` (SSR exports)

## Usage in Code

After adding and building, use your custom icons like any other icon:

```tsx
import { MyIcon } from "@luminpdf/lumin-icons";

// Use the icon (note: exported as MyIcon, but displayName is MyIconIcon)
<MyIcon size={24} weight="bold" color="blue" />;

// With context
import { IconContext } from "@luminpdf/lumin-icons";

<IconContext.Provider value={{ weight: "fill", size: 32 }}>
  <MyIcon />
</IconContext.Provider>;
```

## Workflow

Here's the recommended workflow for adding custom icons:

1. **Design** your icons on a 256x256 grid
2. **Export** as SVG with proper attributes
3. **Preview** with `--dry-run` to check what will be generated
4. **Add** icons using the script
5. **Build** the library with `npm run assemble`
6. **Test** your icons in your application
7. **Commit** the changes to version control

## Troubleshooting

### "Invalid SVG Error"

- Ensure your SVG has proper XML structure
- Check that viewBox is set (script will adjust to "0 0 256 256")
- Remove any embedded fonts or complex elements

### "Icon Already Exists"

- Use `--overwrite` flag to replace existing icons
- Or rename your icon to avoid conflicts
- Check the existing icon list with `ls core/assets/regular/`

### "Missing Weights Warning"

- This is normal if you don't provide all 6 weights
- Missing weights will use fallback from available weights
- Add missing weights later by running the script again with additional files

### "Build Errors After Adding"

- Check that your SVG content is valid
- Ensure no syntax errors in generated components
- Run `npm run assemble` to see detailed error messages
- Check that all required directories exist

### "Import Errors"

- Make sure you've run `npm run assemble` after adding icons
- Check that the icon name is properly pascalized (e.g., `my-icon` → `MyIcon`)
- Verify the export was added to `src/index.ts`

## Advanced Usage

### Batch Processing

For large sets of icons:

```bash
# Process multiple folders
for folder in icons-set-1 icons-set-2 icons-set-3; do
  npm run add-icon:preview -- --folder $folder
done

# After review, add them all
for folder in icons-set-1 icons-set-2 icons-set-3; do
  npm run add-icon -- --folder $folder
done
```

### Custom Naming

If your files don't follow the standard naming convention:

```bash
# Add individual files with custom names
npm run add-icon -- --icon ./special-icon.svg --name custom-special
npm run add-icon -- --icon ./special-icon-2.svg --name custom-special --overwrite
```

### Integration with Design Tools

You can integrate this script with design tools that export SVGs:

1. **Figma**: Use plugins that export to a specific folder
2. **Sketch**: Set up export presets for consistent naming
3. **Adobe Illustrator**: Use actions to batch export with proper settings

## Support

If you encounter issues:

1. Check this guide for common solutions
2. Verify your SVG files meet the requirements
3. Use `--dry-run` to preview changes before applying
4. Check the generated files for any obvious issues

The script is designed to be safe and provides detailed feedback about what it's doing, so you can easily identify and fix any issues.
