import { Box, type BoxProps } from "@mui/material";
import type { ReactNode } from "react";

export interface DynamicColumnsProps extends BoxProps {
  children: ReactNode[];
  spacing?: number;
  columns?: number[]; // Optional custom widths (12-grid)
}
/**
 * Reusable responsive column layout.
 * Automatically distributes child components into equal-width columns based on the number of items.
 * Supports optional custom 12-grid spans while stacking all columns on smaller screens.
 */
const GridPatternDesign = ({
  children,
  spacing = 0,
  columns,
  sx,
  ...props
}: DynamicColumnsProps) => {
  const items = Array.isArray(children) ? children : [children];

  const count = items.length;

  // Default equal width
  const defaultSpan = Math.floor(12 / count);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: spacing,
        width: "100%",
        minHeight: "100vh",
        ...sx,
      }}
      {...props}
    >
      {items.map((child, index) => (
        <Box
          key={index}
          sx={{
            gridColumn: {
              xs: "1 / -1",
              md: `span ${columns?.[index] ?? defaultSpan}`,
            },
            display: "flex",
          }}
        >
          {child}
        </Box>
      ))}
    </Box>
  );
};

export default GridPatternDesign;