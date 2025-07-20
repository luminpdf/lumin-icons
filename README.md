# @lumin-pdf/lumin-icons

A comprehensive icon library for React applications, built on top of [Phosphor Icons](https://phosphoricons.com) with enhanced custom icon support and tooling designed specifically for LuminPDF applications.

[![NPM](https://img.shields.io/npm/v/@lumin-pdf/lumin-icons.svg?style=flat-square)](https://www.npmjs.com/package/@lumin-pdf/lumin-icons)

[![GitHub stars](https://img.shields.io/github/stars/luminpdf/lumin-icons?style=flat-square&label=Star)](https://github.com/luminpdf/lumin-icons)
[![GitHub forks](https://img.shields.io/github/forks/luminpdf/lumin-icons?style=flat-square&label=Fork)](https://github.com/luminpdf/lumin-icons/fork)

## Features

✨ **1,500+ Phosphor Icons** - Complete set of beautiful, consistent icons  
🎨 **Custom Icon Support** - Robust tooling for adding your own icons  
⚡ **Tree-shakable** - Only bundle the icons you use  
🎯 **TypeScript** - Full TypeScript support with proper types  
🔄 **SSR Ready** - Works with Next.js and other SSR frameworks  
🎭 **Multiple Weights** - 6 weight variants (thin, light, regular, bold, fill, duotone)  
⚙️ **Enhanced Tooling** - Scripts for icon management, building, and publishing

## Installation

```bash
npm i @lumin-pdf/lumin-icons
```

## Usage

Simply import the icons you need, and add them anywhere in your render method. The library supports tree-shaking, so your bundle only includes code for the icons you use.

```tsx
import { HorseIcon, HeartIcon, CubeIcon } from "@lumin-pdf/lumin-icons";

const App = () => {
  return (
    <main>
      <HorseIcon />
      <HeartIcon color="#AE2983" weight="fill" size={32} />
      <CubeIcon color="teal" weight="duotone" />
    </main>
  );
};
```

### Custom LuminPDF Icons

This library includes custom icons specifically designed for PDF and document workflows:

```tsx
import {
  PDFIcon,
  SignIcon,
  ToolsConvertIcon,
  HandHeartIcon,
} from "@lumin-pdf/lumin-icons";

const PDFApp = () => {
  return (
    <div>
      <PDFIcon size={24} />
      <SignIcon weight="fill" />
      <ToolsConvertIcon color="blue" />
      <HandHeartIcon weight="duotone" />
    </div>
  );
};
```

### Import Performance Optimization

When importing icons during development directly from the main module `@lumin-pdf/lumin-icons`, some bundlers may eagerly transpile all modules. To avoid this, import individual icons from their specific file paths:

```tsx
import { BellSimpleIcon } from "@lumin-pdf/lumin-icons/dist/csr/BellSimple";
```

#### Next.js Specific Optimizations

If you're using Next.js 13+, consider using [optimizePackageImports](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports) in your next.config.js:

```js
module.exports = {
  experimental: {
    optimizePackageImports: ["@lumin-pdf/lumin-icons"],
  },
};
```

### React Server Components and SSR

When using icons in an SSR environment or React Server Component, import from the `/ssr` submodule:

```tsx
import { FishIcon } from "@lumin-pdf/lumin-icons/ssr";

const MyServerComponent = () => {
  return <FishIcon weight="duotone" />;
};
```

> [!NOTE]
> SSR variants do not use React Context, and thus cannot inherit styles from an ancestor `IconContext`.

### Props

Icon components accept all props that you can pass to a normal SVG element, including inline `style` objects, `onClick` handlers, and more. The main styling props are:

- **color?**: `string` – Icon stroke/fill color. Can be any CSS color string, including `hex`, `rgb`, `rgba`, `hsl`, `hsla`, named colors, or the special `currentColor` variable.
- **size?**: `number | string` – Icon height & width. As with standard React elements, this can be a number, or a string with units in `px`, `%`, `em`, `rem`, `pt`, `cm`, `mm`, `in`.
- **weight?**: `"thin" | "light" | "regular" | "bold" | "fill" | "duotone"` – Icon weight/style. Can also be used, for example, to "toggle" an icon's state: a rating component could use Stars with `weight="regular"` to denote an empty star, and `weight="fill"` to denote a filled star.
- **mirrored?**: `boolean` – Flip the icon horizontally. Can be useful in RTL languages where normal icon orientation is not appropriate.
- **alt?**: `string` – Add accessible alt text to an icon.

### Context

Apply default styles to all icons using React Context:

```tsx
import {
  IconContext,
  HorseIcon,
  HeartIcon,
  CubeIcon,
} from "@lumin-pdf/lumin-icons";

const App = () => {
  return (
    <IconContext.Provider
      value={{
        color: "limegreen",
        size: 32,
        weight: "bold",
        mirrored: false,
      }}
    >
      <div>
        <HorseIcon /> {/* I'm lime-green, 32px, and bold! */}
        <HeartIcon /> {/* Me too! */}
        <CubeIcon /> {/* Me three :) */}
      </div>
    </IconContext.Provider>
  );
};
```

You may create multiple Contexts for styling icons differently in separate regions of an application; icons use the nearest Context above them to determine their style.

### Composability

Components can accept arbitrary SVG elements as children, so long as they are valid children of the `<svg>` element. This can be used to modify an icon with background layers or shapes, filters, animations, and more:

```jsx
const RotatingCube = () => {
  return (
    <CubeIcon color="darkorchid" weight="duotone">
      <animate
        attributeName="opacity"
        values="0;1;0"
        dur="4s"
        repeatCount="indefinite"
      ></animate>
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        dur="5s"
        from="0 0 0"
        to="360 0 0"
        repeatCount="indefinite"
      ></animateTransform>
    </CubeIcon>
  );
};
```

> [!NOTE]
> The coordinate space of slotted elements is relative to the contents of the icon `viewBox`, which is 256x256 square. Only [valid SVG elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Element#SVG_elements_by_category) will be rendered.

### Imports

You may wish to import all icons at once for use in your project, though depending on your bundler this could prevent tree-shaking and make your app's bundle larger.

```tsx
import * as Icon from "@lumin-pdf/lumin-icons";

<Icon.SmileyIcon />
<Icon.FolderIcon weight="thin" />
<Icon.BatteryHalfIcon size="24px" />
<Icon.LmPDFIcon color="red" />
```

## Adding Custom Icons

One of the key features of this library is the ability to easily add your own custom icons while maintaining the same API and styling capabilities as the core Phosphor icons.

### Quick Start

Add icons from a folder:

```bash
npm run add-icon -- --folder ./my-custom-icons
```

Add a single icon:

```bash
npm run add-icon -- --icon ./my-star.svg --name custom-star
```

Preview changes without writing files:

```bash
npm run add-icon:preview -- --folder ./my-custom-icons
```

### SVG Requirements

1. **Grid**: Design on a 256x256 pixel grid
2. **Colors**: Use `currentColor` or `#000` for themeable colors
3. **Elements**: Prefer `path` elements over other shapes
4. **Simplicity**: Keep designs clean and simple for scalability

### Weight Variants

The library supports 6 weight variants:

- **regular** - Default weight
- **thin** - Thinnest stroke
- **light** - Light stroke
- **bold** - Bold stroke
- **fill** - Filled version
- **duotone** - Two-tone version with opacity

If you don't provide all weight variants, the script will create fallback versions using your provided weight.

### Automatic Naming

The script handles special naming conventions:

- `lm-icon-name.svg` → `LmIconName` (removes `lm-` prefix)
- `lm-3-squares.svg` → `LmThreeSquares` (converts numbers to words)
- `2d-chart.svg` → `TwoDChart` (handles mixed alphanumeric)

For detailed guidance, see [CUSTOM_ICONS_GUIDE.md](./CUSTOM_ICONS_GUIDE.md).

### After Adding Icons

1. **Assemble components**: Run `npm run assemble` to regenerate all components
2. **Test imports**: Import and test your new icons
3. **Build**: Run `npm run build` to compile the library

## Development & Publishing

### Development Scripts

- `npm run serve` - Start development server with examples
- `npm run build` - Build the library for production
- `npm run test` - Run tests
- `npm run assemble` - Assemble icon components from source assets
- `npm run add-icon` - Add custom icons (see [Custom Icons](#adding-custom-icons))

### Publishing Scripts

- `npm run publish:check` - Run a dry-run to test the publish process
- `npm run custom-publish` - Interactive publish to npm (runs tests and build automatically)
- `npm run publish:dry` - Run dry-run publish to npm
- `npm run publish:beta` - Publish as beta version
- `npm run publish:latest` - Publish as latest version

### Version Management

- `npm run version:patch` - Bump patch version (0.0.x)
- `npm run version:minor` - Bump minor version (0.x.0)
- `npm run version:major` - Bump major version (x.0.0)
- `npm run release:patch` - Bump patch version and publish
- `npm run release:minor` - Bump minor version and publish
- `npm run release:major` - Bump major version and publish

### Publishing Workflow

Before publishing to npm, ensure you have:

1. **Authentication**: Log in to npm

   ```bash
   npm login
   ```

2. **Tests pass**: All tests should pass

   ```bash
   npm run test
   ```

3. **Clean build**: Ensure a fresh build

   ```bash
   npm run build
   ```

4. **Dry run**: Test the publish process

   ```bash
   npm run publish:check
   ```

5. **Publish**: When ready, publish to npm
   ```bash
   npm run custom-publish
   ```

The publish script automatically:

- Verifies npm authentication
- Runs tests and builds the package
- Checks for uncommitted changes
- Validates the dist folder exists
- Publishes to npm with proper configuration

### Custom Publish Options

You can also use the publish script directly with options:

```bash
# Dry run
tsx scripts/publish.ts --dry-run

# Publish as beta
tsx scripts/publish.ts --tag beta

# Skip tests (not recommended)
tsx scripts/publish.ts --skip-tests

# Show help
tsx scripts/publish.ts --help
```

## Architecture

This library is built with a dual structure:

- **Core Icons** (`core/`): Phosphor Icons submodule (1,500+ icons)
- **Custom Icons** (`src/assets/`): LuminPDF-specific icons and your custom additions

This separation ensures:

- Core icons stay up-to-date with Phosphor releases
- Custom icons won't be overwritten by updates
- Easy management and versioning of custom additions

## License

MIT © [LuminPDF](https://luminpdf.com)

Built on top of [Phosphor Icons](https://phosphoricons.com) by [Phosphor Icons](https://github.com/phosphor-icons)
