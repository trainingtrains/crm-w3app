import { styled } from "@mui/material/styles";
import { BaseButton } from "./BaseButton";

export const DeleteButton = styled(BaseButton)({
  color: "var(--error)",

  backgroundColor: "var(--surface)",

  border: "1px solid var(--error)",

  "&:hover": {
    backgroundColor: "var(--error)",
    color: "#fff",
    boxShadow: "var(--shadow-sm)",
  },
});