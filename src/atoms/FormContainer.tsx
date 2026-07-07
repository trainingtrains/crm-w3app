import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const FormContainer = styled(Paper)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  padding: "24px", // FIX: Forces the layout padding over any MUI overrides
  gap: "var(--space-lg)",
  borderRadius: "var(--radius-md)",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  boxShadow: "none",
  overflow: "auto",
});
