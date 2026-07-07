import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";

export const StyledFormControlLabel = styled(FormControlLabel)({
  width: "100%",

  margin: 0,

  display: "flex",
  alignItems: "center",

  gap: "var(--space-xs)",

  "& .MuiTypography-root": {
    fontSize: "var(--font-md)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--text)",
    userSelect: "none",
  },

  "& .MuiCheckbox-root, & .MuiRadio-root, & .MuiSwitch-root": {
    padding: "4px",
  },
});