import {
  styled,
  alpha,
} from "@mui/material/styles";

import {
  Box,
  Paper,
  Button,
  Checkbox,
  Switch,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";

/* ==========================================================
   PAGE CONTAINER
========================================================== */

export const FormContainer = styled(Paper)(
  ({ theme }) => ({
    width: "100%",
    maxWidth: "1800px",
    margin: "0 auto",

    padding: theme.spacing(3),

    borderRadius: 20,

    background:
      theme.palette.background.paper,

    boxShadow:
      "0 8px 32px rgba(15,23,42,0.08)",

    overflow: "hidden",

    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2.5),
    },

    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
      borderRadius: 16,
    },
  })
);

/* ==========================================================
   HEADER
========================================================== */

export const PageHeader = styled(Box)(
  ({ theme }) => ({
    marginBottom: theme.spacing(4),

    textAlign: "center",
  })
);

export const PageTitle = styled(
  Typography
)(({ theme }) => ({
  fontWeight: 700,

  color: theme.palette.text.primary,

  fontSize:
    "clamp(1.6rem,2vw,2.5rem)",

  lineHeight: 1.2,
}));

export const PageSubTitle = styled(
  Typography
)(({ theme }) => ({
  marginTop: theme.spacing(1),

  color: theme.palette.text.secondary,

  maxWidth: 700,

  marginInline: "auto",
}));

/* ==========================================================
   CONTENT WRAPPER
========================================================== */

export const ContentWrapper = styled(Box)(
  ({ theme }) => ({
    width: "100%",

    display: "flex",

    flexDirection: "column",

    gap: theme.spacing(2),
  })
);

/* ==========================================================
   TEXT FIELD
========================================================== */

export const StyledTextField =
  styled(TextField)(({ theme }) => ({
    width: "100%",

    "& .MuiInputLabel-root": {
      fontWeight: 500,
    },

    "& .MuiOutlinedInput-root": {
      borderRadius: 14,

      backgroundColor:
        theme.palette.background.paper,

      transition:
        "all 0.2s ease-in-out",

      "&:hover": {
        boxShadow:
          "0 2px 12px rgba(0,0,0,0.08)",
      },

      "&.Mui-focused": {
        boxShadow: `0 0 0 4px ${alpha(
          theme.palette.primary.main,
          0.12
        )}`,
      },
    },
  }));

/* ==========================================================
   CHECKBOX / SWITCH
========================================================== */

export const StyledCheckbox =
  styled(Checkbox)({
    transform: "scale(1.05)",
  });

export const StyledSwitch =
  styled(Switch)({
    transform: "scale(1.05)",
  });

export const StyledFormControlLabel =
  styled(FormControlLabel)(
    ({ theme }) => ({
      width: "100%",

      marginLeft: 0,

      "& .MuiTypography-root": {
        fontWeight: 500,

        color:
          theme.palette.text.primary,
      },
    })
  );

/* ==========================================================
   BUTTONS
========================================================== */

const BaseButton = styled(Button)(
  ({ theme }) => ({
    minWidth: 140,

    minHeight: 48,

    borderRadius: 12,

    textTransform: "none",

    fontWeight: 600,

    transition:
      "all .2s ease-in-out",

    "&:hover": {
      transform: "translateY(-2px)",
    },

    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  })
);

export const SearchButton = styled(
  BaseButton
)(({ theme }) => ({
  boxShadow: `0 8px 20px ${alpha(
    theme.palette.primary.main,
    0.25
  )}`,
}));

export const ResetButton = styled(
  BaseButton
)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
}));

/* ==========================================================
   ACTION BAR
========================================================== */

export const ActionContainer =
  styled(Box)(({ theme }) => ({
    width: "100%",

    display: "flex",

    justifyContent: "flex-end",

    alignItems: "center",

    gap: theme.spacing(2),

    marginTop: theme.spacing(3),

    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",

      justifyContent: "stretch",
    },
  }));