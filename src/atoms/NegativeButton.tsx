
/* =========================
   Negative
========================= */

import { alpha, styled } from "@mui/material/styles";
import { BaseButton } from "./BaseButton";

export const NegativeButton =
  styled(BaseButton)(({ theme }) => ({
    color: "#fff",

    backgroundColor:
      theme.palette.error.main,

    "&:hover": {
      backgroundColor:
        theme.palette.error.dark,

      boxShadow: `0 6px 20px ${alpha(
        theme.palette.error.main,
        0.3
      )}`,
    },
  }));