import { styled } from "@mui/material/styles";
import { BaseButton } from "./BaseButton";

export const NegativeButton = styled(BaseButton)({
  color: "var(--text-secondary)",

  backgroundColor: "var(--surface)",

  border: "1px solid var(--border)",

  "&:hover": {
    backgroundColor: "var(--background)",
    borderColor: "var(--primary)",
    color: "var(--primary)",
    boxShadow: "var(--shadow-sm)",
  },
});