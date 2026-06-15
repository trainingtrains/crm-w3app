import Button from "@mui/material/Button";
import { styled, alpha } from "@mui/material/styles";

/* =========================
   Base Button
========================= */

const BaseButton = styled(Button)(
  ({ theme }) => ({
    minHeight: 42,
    minWidth: 120,

    padding: theme.spacing(1, 2),

    borderRadius: 10,

    fontWeight: 600,

    fontSize: "0.875rem",

    textTransform: "none",

    transition: "all 0.2s ease",

    boxShadow: "none",

    "&:hover": {
      transform: "translateY(-2px)",
    },

    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  })
);

/* =========================
   Primary
========================= */

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

/* =========================
   Secondary
========================= */

export const SecondaryButton =
  styled(BaseButton)(({ theme }) => ({
    color:
      theme.palette.text.primary,

    backgroundColor:
      theme.palette.grey[100],

    border: `1px solid ${theme.palette.divider}`,

    "&:hover": {
      backgroundColor:
        theme.palette.grey[200],
    },
  }));

/* =========================
   Positive
========================= */

export const PositiveButton =
  styled(BaseButton)(({ theme }) => ({
    color: "#fff",

    backgroundColor:
      theme.palette.success.main,

    "&:hover": {
      backgroundColor:
        theme.palette.success.dark,

      boxShadow: `0 6px 20px ${alpha(
        theme.palette.success.main,
        0.3
      )}`,
    },
  }));

/* =========================
   Negative
========================= */

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