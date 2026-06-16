import { styled } from "@mui/material/styles";
import { BaseButton } from "./BaseButton";

export const ResetButton = styled(
  BaseButton
)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
}));
