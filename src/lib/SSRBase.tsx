import * as React from "react";
import type { ReactElement } from "react";
import { IconProps, IconWeight } from "./types";

interface IconBaseProps extends IconProps {
  weights: Map<IconWeight, ReactElement>;
}

const SSRBase = React.forwardRef<SVGSVGElement, IconBaseProps>((props, ref) => {
  const {
    alt,
    color = "currentColor",
    size = "1em",
    weight = "regular",
    mirrored = false,
    viewBox = "0 0 256 256",
    children,
    weights,
    ...restProps
  } = props;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      viewBox={viewBox}
      transform={mirrored ? "scale(-1, 1)" : undefined}
      {...restProps}
    >
      {!!alt && <title>{alt}</title>}
      {children}
      {weights.get(weight)}
    </svg>
  );
});

SSRBase.displayName = "SSRBase";

export default SSRBase;
