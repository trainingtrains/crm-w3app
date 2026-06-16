import { styled,alpha } from "@mui/material/styles";
import { BaseButton } from "./BaseButton";

export const SearchButton = styled(
  BaseButton
)(({ theme }) => ({
  boxShadow: `0 8px 20px ${alpha(
    theme.palette.primary.main,
    0.25
  )}`,
}));
