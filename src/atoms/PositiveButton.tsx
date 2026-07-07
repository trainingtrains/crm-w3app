import { styled } from "@mui/material/styles";
import { BaseButton } from "./BaseButton";

export const PositiveButton = styled(BaseButton)({
  color: "#fff",

  background: "var(--success)",

  border: "1px solid var(--success)",

  "&:hover": {
    background: "var(--success-hover)",
    borderColor: "var(--success-hover)",
    boxShadow: "var(--shadow-sm)",
  },

  "&:disabled": {
    opacity: 0.6,
  },
});