import { Box, styled } from "@mui/material";

const drawerWidth = 250

export const NavbarWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: "100%",

  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,

    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));