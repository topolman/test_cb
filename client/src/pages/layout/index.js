import React from "react";
import AppBar from "@material-ui/core/AppBar";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Максим Репьев "}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
}));

export default function Album(props) {
  const { children = <></> } = props;
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <AccountBalanceIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            test_cb
          </Typography>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        ></Typography>
        <Copyright />
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
