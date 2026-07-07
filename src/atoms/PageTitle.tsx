import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

/* ==========================================================
   PAGE TITLE
========================================================== */

export const PageTitle = styled(Typography)({
  display: "flex",
  alignItems: "center",
  gap: "var(--space-sm)",

  color: "var(--text)",

  fontSize: "var(--font-xl)",
  fontWeight: "var(--font-weight-bold)",

  lineHeight: 1.2,

  margin: 0,

  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});