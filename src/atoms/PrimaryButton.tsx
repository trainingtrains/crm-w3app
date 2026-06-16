

/* =========================
   Primary
========================= */

import { alpha, styled } from "@mui/material/styles";
import { BaseButton } from "./BaseButton";

export const PrimaryButton = styled(
  BaseButton
)(({ theme }) => ({
  color: "#fff",

  backgroundColor:
    theme.palette.primary.main,

  "&:hover": {
    backgroundColor:
      theme.palette.primary.dark,

    boxShadow: `0 6px 20px ${alpha(
      theme.palette.primary.main,
      0.3
    )}`,
  },
}));