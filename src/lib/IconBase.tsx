import * as React from "react";
import type { ReactElement } from "react";
import { IconContext } from "./context";
import { IconProps, IconWeight } from "./types";

interface IconBaseProps extends IconProps {
  weights: Map<IconWeight, ReactElement>;
}

const IconBase = React.forwardRef<SVGSVGElement, IconBaseProps>(
  (props, ref) => {
    const {
      alt,
      color,
      size,
      weight,
      mirrored,
      viewBox,
      children,
      weights,
      ...restProps
    } = props;

    const {
      color: contextColor = "currentColor",
      size: contextSize,
      weight: contextWeight = "regular",
      mirrored: contextMirrored = false,
      viewBox: contextViewBox = "0 0 256 256",
      ...restContext
    } = React.useContext(IconContext);

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size ?? contextSize}
        height={size ?? contextSize}
        fill={color ?? contextColor}
        viewBox={viewBox ?? contextViewBox}
        transform={mirrored || contextMirrored ? "scale(-1, 1)" : undefined}
        {...restContext}
        {...restProps}
      >
        {!!alt && <title>{alt}</title>}
        {children}
        {weights.get(weight ?? contextWeight)}
      </svg>
    );
  }
);

IconBase.displayName = "IconBase";

export default IconBase;
