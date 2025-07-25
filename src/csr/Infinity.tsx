/* GENERATED FILE */
import * as React from "react";
import type { Icon } from "../lib/types";
import IconBase from "../lib/IconBase";
import weights from "../defs/Infinity";

/**
 * @regular ![img](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9IiMwMDAiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRkZGIiByeD0iNDAiIHJ5PSI0MCIvPjxwYXRoIGQ9Ik0yNDgsMTI4YTU2LDU2LDAsMCwxLTk1LjYsMzkuNmwtLjMzLS4zNUw5Mi4xMiw5OS41NWE0MCw0MCwwLDEsMCwwLDU2LjlsOC41Mi05LjYyYTgsOCwwLDEsMSwxMiwxMC42MWwtOC42OSw5LjgxLS4zMy4zNWE1Niw1NiwwLDEsMSwwLTc5LjJsLjMzLjM1LDU5Ljk1LDY3LjdhNDAsNDAsMCwxLDAsMC01Ni45bC04LjUyLDkuNjJhOCw4LDAsMSwxLTEyLTEwLjYxbDguNjktOS44MS4zMy0uMzVBNTYsNTYsMCwwLDEsMjQ4LDEyOFoiLz48L3N2Zz4=)
 * @thin ![img](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9IiMwMDAiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRkZGIiByeD0iNDAiIHJ5PSI0MCIvPjxwYXRoIGQ9Ik0yNDQsMTI4YTUyLDUyLDAsMCwxLTg4Ljc3LDM2Ljc3bC0uMTctLjE4TDk1LDk2LjhhNDQsNDQsMCwxLDAsMCw2Mi40bDguNi05LjcyYTQsNCwwLDAsMSw2LDUuM2wtOC42OCw5LjgxLS4xNy4xOGE1Miw1MiwwLDEsMSwwLTczLjU0bC4xNy4xOCw2MCw2Ny43OWE0NCw0NCwwLDEsMCwwLTYyLjRsLTguNiw5LjcyYTQsNCwwLDAsMS02LTUuM2w4LjY4LTkuODEuMTctLjE4QTUyLDUyLDAsMCwxLDI0NCwxMjhaIi8+PC9zdmc+)
 * @light ![img](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9IiMwMDAiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRkZGIiByeD0iNDAiIHJ5PSI0MCIvPjxwYXRoIGQ9Ik0yNDYsMTI4YTU0LDU0LDAsMCwxLTkyLjE4LDM4LjE4LDMuMDcsMy4wNywwLDAsMS0uMjUtLjI2bC02MC02Ny43NGE0Miw0MiwwLDEsMCwwLDU5LjY0bDguNTctOS42N2E2LDYsMCwxLDEsOSw4bC04LjY5LDkuODFhMy4wNywzLjA3LDAsMCwxLS4yNS4yNiw1NCw1NCwwLDEsMSwwLTc2LjM2LDMuMDcsMy4wNywwLDAsMSwuMjUuMjZsNjAsNjcuNzRhNDIsNDIsMCwxLDAsMC01OS42NGwtOC41Nyw5LjY3YTYsNiwwLDEsMS05LThsOC42OS05LjgxYTMuMDcsMy4wNywwLDAsMSwuMjUtLjI2QTU0LDU0LDAsMCwxLDI0NiwxMjhaIi8+PC9zdmc+)
 * @bold ![img](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9IiMwMDAiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRkZGIiByeD0iNDAiIHJ5PSI0MCIvPjxwYXRoIGQ9Ik0yNTIsMTI4YTYwLDYwLDAsMCwxLTEwMi40Myw0Mi40M2wtLjQ5LS41M0w4OS4yMiwxMDIuMzFhMzYsMzYsMCwxLDAsMCw1MS4zOGwzLjA4LTMuNDhhMTIsMTIsMCwxLDEsMTgsMTUuOTFsLTMuMzUsMy43OC0uNDkuNTNhNjAsNjAsMCwxLDEsMC04NC44NmwuNDkuNTMsNTkuODYsNjcuNTlhMzYsMzYsMCwxLDAsMC01MS4zOGwtMy4wOCwzLjQ4YTEyLDEyLDAsMSwxLTE4LTE1LjkxbDMuMzUtMy43OC40OS0uNTNBNjAsNjAsMCwwLDEsMjUyLDEyOFoiLz48L3N2Zz4=)
 * @fill ![img](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9IiMwMDAiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRkZGIiByeD0iNDAiIHJ5PSI0MCIvPjxwYXRoIGQ9Ik0yMTYsNDBINDBBMTYsMTYsMCwwLDAsMjQsNTZWMjAwYTE2LDE2LDAsMCwwLDE2LDE2SDIxNmExNiwxNiwwLDAsMCwxNi0xNlY1NkExNiwxNiwwLDAsMCwyMTYsNDBaTTIwNC4yOCwxNTYuMjhhNDAsNDAsMCwwLDEtNTYuNC4xN0w5Ny4yOSwxMTEuMzQsOTcsMTExQTI0LDI0LDAsMSwwLDk3LDE0NWMuMzYtLjM2LjcxLS43MywxLTEuMWE4LDgsMCwxLDEsMTIsMTAuNmMtLjU1LjYyLTEuMTMsMS4yMy0xLjcxLDEuODFhNDAsNDAsMCwxLDEtLjE3LTU2LjczbDUwLjU4LDQ1LjExLjMzLjMxQTI0LDI0LDAsMSwwLDE1OSwxMTFjLS4zNi4zNi0uNy43Mi0xLDEuMWE4LDgsMCwwLDEtMTItMTAuNTljLjU0LS42MiwxLjEyLTEuMjQsMS43MS0xLjgyYTQwLDQwLDAsMCwxLDU2LjU3LDU2LjU2WiIvPjwvc3ZnPg==)
 * @duotone ![img](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9IiMwMDAiPjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRkZGIiByeD0iNDAiIHJ5PSI0MCIvPjxwYXRoIGQ9Ik0yMjUuOTQsMTYxLjk0YTQ4LDQ4LDAsMCwxLTY3Ljg4LDBMMTI4LDEyOGwzMC4wNi0zMy45NGE0OCw0OCwwLDAsMSw2Ny44OCw2Ny44OFpNMzAuMDYsOTQuMDZhNDgsNDgsMCwwLDAsNjcuODgsNjcuODhMMTI4LDEyOCw5Ny45NCw5NC4wNkE0OCw0OCwwLDAsMCwzMC4wNiw5NC4wNloiIG9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik0yNDgsMTI4YTU2LDU2LDAsMCwxLTk1LjYsMzkuNmwtLjMzLS4zNUw5Mi4xMiw5OS41NWE0MCw0MCwwLDEsMCwwLDU2LjlsOC41Mi05LjYyYTgsOCwwLDEsMSwxMiwxMC42MWwtOC42OSw5LjgxLS4zMy4zNWE1Niw1NiwwLDEsMSwwLTc5LjJsLjMzLjM1LDU5Ljk1LDY3LjdhNDAsNDAsMCwxLDAsMC01Ni45bC04LjUyLDkuNjJhOCw4LDAsMSwxLTEyLTEwLjYxbDguNjktOS44MS4zMy0uMzVBNTYsNTYsMCwwLDEsMjQ4LDEyOFoiLz48L3N2Zz4=)
 */
const I: Icon = React.forwardRef((props, ref) => (
  <IconBase ref={ref} {...props} weights={weights} />
));

I.displayName = "InfinityIcon";

/** @deprecated Use InfinityIcon */
export const Infinity = I;
export { I as InfinityIcon };
