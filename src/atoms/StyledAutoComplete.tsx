import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material/styles";

export const StyledAutocomplete = styled(Autocomplete)({
  width: "100%",
  minWidth: "var(--field-min-width)",
  "& .MuiAutocomplete-popupIndicator": {
    transition: "transform var(--transition)",
  },
  "& .MuiAutocomplete-popupIndicatorOpen": {
    transform: "rotate(180deg)",
  },
  // FIX: Force target root indicator block + override standard hover/visibility overrides
  "& .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-clearIndicatorOpen": {
    display: "none !important",
  },
  "& .MuiAutocomplete-input": {
    "&::selection": {
      backgroundColor: "transparent",
    },
  },
});
