import { Box, type BoxProps } from "@mui/material";
import type { ReactNode } from "react";

interface AppContainerProps extends BoxProps {
  children: ReactNode;
}

const AppContainer = ({
  children,
  sx,
  ...props
}: AppContainerProps) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "var(--app-theme-color)",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default AppContainer;