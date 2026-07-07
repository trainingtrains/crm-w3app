import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

/* ==========================================================
   SWITCH
========================================================== */

export const StyledSwitch = styled(Switch)({
  margin: 0,

  "& .MuiSwitch-switchBase": {
    padding: 6,
  },

  "& .MuiSwitch-thumb": {
    width: 16,
    height: 16,
  },

  "& .MuiSwitch-track": {
    borderRadius: 10,
  },
});